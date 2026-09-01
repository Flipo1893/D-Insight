import { NextResponse } from "next/server";
import { analyse } from "@/lib/site-check/analyse";
import { guardUrl } from "@/lib/site-check/guard";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { listSites } from "@/lib/mongodb/sites";
import { recordRun } from "@/lib/monitor/store";
import { monitorSecret } from "@/lib/monitor/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Runs the check against every customer site and records the numbers.
 *
 * Meant to be called on a schedule, not by a person. Two hosts are covered:
 * vercel.json has a cron entry, and .github/workflows/monitor.yml does the
 * same from GitHub for anywhere else. Both send the shared secret.
 *
 * Protected by a secret rather than left open, because it makes this server
 * fetch a list of URLs on demand and would otherwise be a free amplifier.
 * Comparison uses timingSafeEqual so the check cannot be brute-forced a
 * character at a time.
 */
function authorised(request: Request): boolean {
  if (!monitorSecret) return false;

  const header =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (header.length !== monitorSecret.length) return false;

  // Constant-time compare without pulling in node:crypto for four lines.
  let diff = 0;
  for (let i = 0; i < header.length; i++) {
    diff |= header.charCodeAt(i) ^ monitorSecret.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(request: Request) {
  if (!authorised(request)) {
    // 404, not 401: an unauthenticated caller learns nothing about whether
    // this endpoint exists.
    return new NextResponse(null, { status: 404 });
  }

  if (!isMongoConfigured) {
    return NextResponse.json(
      { error: "MONGODB_URI fehlt, es gibt keine Seiten zu prüfen." },
      { status: 503 },
    );
  }

  const sites = await listSites();
  const results: { site: string; ok: boolean; score?: number }[] = [];

  for (const site of sites) {
    if (!site.siteUrl) continue;

    const guarded = await guardUrl(site.siteUrl);
    if (!guarded.ok) {
      // A customer URL pointing somewhere internal is a configuration
      // mistake, not something to fetch.
      results.push({ site: site.siteName, ok: false });
      continue;
    }

    try {
      const report = await analyse(guarded.url);
      await recordRun({
        userId: site.userId,
        siteUrl: report.finalUrl,
        at: new Date(),
        reachable: true,
        score: report.score,
        a11yScore: report.a11yScore,
        loadMs: report.loadMs,
        failing: report.items
          .filter((item) => item.status !== "gut")
          .map((item) => item.id),
      });
      results.push({ site: site.siteName, ok: true, score: report.score });
    } catch {
      // Unreachable is itself a finding, and the one most worth recording.
      await recordRun({
        userId: site.userId,
        siteUrl: site.siteUrl,
        at: new Date(),
        reachable: false,
        score: 0,
        a11yScore: 0,
        loadMs: 0,
        failing: [],
      });
      results.push({ site: site.siteName, ok: false });
    }
  }

  return NextResponse.json({ checked: results.length, results });
}
