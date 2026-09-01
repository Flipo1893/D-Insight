import { NextResponse } from "next/server";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { recordView, today, visitorHash } from "@/lib/stats/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Only our own paths are recorded, and only a bounded amount of them. */
function cleanPath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value.slice(0, 120);
}

/** Referrer is reduced to its host: who sent them, not what they were reading. */
function cleanSource(referrer: string | null, selfHost: string): string {
  if (!referrer) return "direkt";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host === selfHost.replace(/^www\./, "") ? "intern" : host.slice(0, 80);
  } catch {
    return "direkt";
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const path = cleanPath((body as { path?: unknown })?.path);
  if (!path) {
    return NextResponse.json({ error: "Ungültiger Pfad." }, { status: 400 });
  }

  // Validation runs before the database check, so a malformed request is
  // rejected the same way whether or not analytics is configured. Bailing out
  // first would leave the guard untested until the day it matters.
  if (!isMongoConfigured) {
    return NextResponse.json({ ok: true, recorded: false });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unbekannt";
  const userAgent = request.headers.get("user-agent") ?? "unbekannt";

  // Obvious crawlers would drown the numbers they are supposed to inform.
  if (/bot|crawler|spider|preview|monitor|curl|wget|headless/i.test(userAgent)) {
    return NextResponse.json({ ok: true, recorded: false });
  }

  const day = today();
  const selfHost = new URL(request.url).hostname;

  await recordView({
    path,
    source: cleanSource(request.headers.get("referer"), selfHost),
    visitor: visitorHash(ip, userAgent, day),
    day,
  });

  return NextResponse.json({ ok: true, recorded: true });
}
