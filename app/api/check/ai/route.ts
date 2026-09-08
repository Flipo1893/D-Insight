import { NextResponse } from "next/server";
import { guardUrl } from "@/lib/site-check/guard";
import { judgePage } from "@/lib/site-check/ai/judge";
import { aiCheckEnabled } from "@/lib/site-check/ai/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The model's assessment, asked for separately from the measurements.
 *
 * It was inline at first, and that was wrong. The measurements take about a
 * second; a local model takes ten to twenty. Putting them in one request
 * meant the visitor watched a spinner for twenty seconds to see numbers that
 * had been ready for nineteen of them, and a slow or stuck model held the
 * whole report hostage. Splitting them makes that impossible by construction
 * rather than by carefully written error handling: the report cannot wait
 * for something it no longer asks for.
 *
 * The cost is fetching the page a second time. That is one extra request to
 * someone else's server, and it buys a report that arrives immediately and
 * an assessment that can take as long as it needs.
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

const FETCH_TIMEOUT_MS = 12_000;
const MAX_BYTES = 1_500_000;

export async function POST(request: Request) {
  // Nothing to say and nothing to spend when no model is configured. The
  // browser treats this exactly like a model that declined to answer.
  if (!aiCheckEnabled) return NextResponse.json({ ai: null });

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unbekannt";
  if (rateLimited(ip)) return NextResponse.json({ ai: null }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ai: null }, { status: 400 });
  }

  const raw = typeof (body as { url?: unknown })?.url === "string"
    ? ((body as { url: string }).url)
    : "";

  // The same guard as the main check. This endpoint also makes our server
  // fetch an address a stranger chose, so it gets the same treatment.
  const guarded = await guardUrl(raw);
  if (!guarded.ok) return NextResponse.json({ ai: null }, { status: 400 });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(guarded.url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "D-Insight-Schnellcheck/1.0 (+https://www.d-insight.ch)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    const reader = response.body?.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    if (reader) {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.length;
        chunks.push(value);
        if (total > MAX_BYTES) {
          await reader.cancel();
          break;
        }
      }
    }

    const html = new TextDecoder().decode(
      chunks.length === 1 ? chunks[0] : Buffer.concat(chunks),
    );

    return NextResponse.json({ ai: await judgePage(html) });
  } catch {
    // Unreachable page, timeout, model gone. All of them mean the same thing
    // to the visitor, who already has their numbers: no opinion this time.
    return NextResponse.json({ ai: null });
  } finally {
    clearTimeout(timer);
  }
}
