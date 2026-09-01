import { NextResponse } from "next/server";
import { analyse } from "@/lib/site-check/analyse";
import { guardUrl } from "@/lib/site-check/guard";

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

  const raw =
    typeof body === "object" && body !== null && "url" in body
      ? String((body as { url: unknown }).url)
      : "";

  const guarded = await guardUrl(raw);
  if (!guarded.ok) {
    return NextResponse.json({ error: guarded.reason }, { status: 400 });
  }

  try {
    const report = await analyse(guarded.url);
    return NextResponse.json(report);
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
