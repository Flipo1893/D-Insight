import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/**
 * The quick check fetches a URL that a stranger typed into a public form,
 * from our server. Without a guard that is a server-side request forgery
 * hole: someone enters http://169.254.169.254/ or http://localhost:5432 and
 * uses our server to reach things only it can see.
 *
 * So: https and http only, no credentials in the URL, and the hostname must
 * resolve to a public address.
 */

const BLOCKED_V4 = [
  { name: "loopback", test: (p: number[]) => p[0] === 127 },
  { name: "private", test: (p: number[]) => p[0] === 10 },
  { name: "private", test: (p: number[]) => p[0] === 192 && p[1] === 168 },
  {
    name: "private",
    test: (p: number[]) => p[0] === 172 && p[1] >= 16 && p[1] <= 31,
  },
  { name: "link-local", test: (p: number[]) => p[0] === 169 && p[1] === 254 },
  { name: "carrier-grade NAT", test: (p: number[]) => p[0] === 100 && p[1] >= 64 && p[1] <= 127 },
  { name: "unspecified", test: (p: number[]) => p[0] === 0 },
  { name: "reserved", test: (p: number[]) => p[0] >= 224 },
];

function classifyV4(address: string): string | null {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some(Number.isNaN)) return "invalid";
  return BLOCKED_V4.find((rule) => rule.test(parts))?.name ?? null;
}

function classifyV6(address: string): string | null {
  const value = address.toLowerCase();
  if (value === "::1" || value === "::") return "loopback";
  if (value.startsWith("fe80")) return "link-local";
  if (/^f[cd]/.test(value)) return "unique local";
  // ::ffff:127.0.0.1 style mapped addresses smuggle IPv4 through IPv6.
  const mapped = value.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return classifyV4(mapped[1]);
  return null;
}

export type GuardResult =
  | { ok: true; url: URL }
  | { ok: false; reason: string };

export async function guardUrl(raw: string): Promise<GuardResult> {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, reason: "Bitte geben Sie eine Adresse ein." };

  // People type "firma.ch", not "https://firma.ch".
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return { ok: false, reason: "Das sieht nicht nach einer gültigen Adresse aus." };
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { ok: false, reason: "Nur http- und https-Adressen werden geprüft." };
  }

  if (url.username || url.password) {
    return { ok: false, reason: "Adressen mit Zugangsdaten werden nicht geprüft." };
  }

  if (!url.hostname.includes(".")) {
    return { ok: false, reason: "Bitte geben Sie eine vollständige Domain an." };
  }

  const literal = isIP(url.hostname);
  if (literal) {
    const blocked =
      literal === 4 ? classifyV4(url.hostname) : classifyV6(url.hostname);
    if (blocked) {
      return { ok: false, reason: "Diese Adresse liegt in einem internen Netz." };
    }
    return { ok: true, url };
  }

  let addresses: { address: string; family: number }[];
  try {
    addresses = await lookup(url.hostname, { all: true });
  } catch {
    return { ok: false, reason: "Diese Domain konnte nicht aufgelöst werden." };
  }

  // Every resolved address has to be public, otherwise a hostname with one
  // public and one internal record would still get through.
  for (const { address, family } of addresses) {
    const blocked = family === 4 ? classifyV4(address) : classifyV6(address);
    if (blocked) {
      return { ok: false, reason: "Diese Adresse liegt in einem internen Netz." };
    }
  }

  return { ok: true, url };
}
