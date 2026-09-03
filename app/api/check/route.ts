import { NextResponse } from "next/server";
import { analyse } from "@/lib/site-check/analyse";
import { guardUrl } from "@/lib/site-check/guard";
import { saveReport } from "@/lib/site-check/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Very small in-memory throttle. This endpoint makes our server fetch a URL
 * a stranger chose, so it should not be free to hammer. Per-process state is
 * enough here: it is a speed bump, not a security control, and the guard is
 * what actually keeps the request safe.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 500) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unbekannt";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Zu viele Prüfungen. Bitte warten Sie einen Moment." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const payload = (body ?? {}) as {
    url?: unknown;
    rivalUrl?: unknown;
    share?: unknown;
  };
  const raw = typeof payload.url === "string" ? payload.url : "";
  const rivalRaw = typeof payload.rivalUrl === "string" ? payload.rivalUrl.trim() : "";

  const guarded = await guardUrl(raw);
  if (!guarded.ok) {
    return NextResponse.json({ error: guarded.reason }, { status: 400 });
  }

  // Optional second site. A failure here must not sink the primary report:
  // the visitor came to see their own numbers.
  let rival: Awaited<ReturnType<typeof analyse>> | null = null;
  let rivalError: string | null = null;
  if (rivalRaw) {
    const guardedRival = await guardUrl(rivalRaw);
    if (!guardedRival.ok) {
      rivalError = guardedRival.reason;
    } else {
      try {
        rival = await analyse(guardedRival.url);
      } catch {
        rivalError = "Die Vergleichsseite konnte nicht geladen werden.";
      }
    }
  }

  try {
    // Only the visitor's own site is put in front of the model. The rival is
    // a comparison of measurements, and doubling the slowest and, on a paid
    // API, the only billed part of the check to decorate someone else's page
    // is not worth it.
    const report = await analyse(guarded.url, { withAi: true });

    // Sharing stores the report this server just computed, never a body
    // sent from the browser. Otherwise anyone could publish arbitrary
    // content under our domain.
    const shareId =
      payload.share === true ? await saveReport(report, rival) : null;

    return NextResponse.json({ ...report, rival, rivalError, shareId });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(
      {
        error: aborted
          ? "Die Seite hat nicht rechtzeitig geantwortet. Das ist selbst schon ein Befund."
          : "Die Seite konnte nicht geladen werden. Ist die Adresse erreichbar?",
      },
      { status: 502 },
    );
  }
}
