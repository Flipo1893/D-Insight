import type { Collection } from "mongodb";
import { getMongoClientPromise } from "@/lib/mongodb/client";
import { isMongoConfigured, mongodbDbName } from "@/lib/mongodb/config";
import type { Site } from "@/lib/mongodb/sites";

/**
 * One measurement of one customer site at one point in time.
 *
 * Only the numbers are kept, not the full report. A year of full reports is
 * a lot of storage for data nobody reads, and the numbers are what a trend
 * is made of. The failing item ids are kept so we can say what changed
 * rather than only that something did.
 */
export type MonitorRun = {
  userId: string;
  siteUrl: string;
  at: Date;
  reachable: boolean;
  score: number;
  a11yScore: number;
  loadMs: number;
  /** Ids of checks that are not "gut", so a drop can be explained. */
  failing: string[];
};

export type SiteTrend = {
  userId: string;
  siteName: string;
  siteUrl: string;
  latest: MonitorRun | null;
  previous: MonitorRun | null;
  history: MonitorRun[];
};

const TTL_DAYS = 730;

let indexReady: Promise<unknown> | undefined;

async function getCollection(): Promise<Collection<MonitorRun>> {
  const client = await getMongoClientPromise();
  const collection = client
    .db(mongodbDbName)
    .collection<MonitorRun>("monitorruns");

  indexReady ??= Promise.all([
    collection.createIndex({ userId: 1, at: -1 }),
    collection.createIndex(
      { at: 1 },
      { expireAfterSeconds: 60 * 60 * 24 * TTL_DAYS, name: "at_ttl" },
    ),
  ]);
  await indexReady;

  return collection;
}

export async function recordRun(run: MonitorRun): Promise<void> {
  if (!isMongoConfigured) return;
  const collection = await getCollection();
  await collection.insertOne(run);
}

/** Newest first. Used for both the customer trend and the admin overview. */
export async function getHistory(
  userId: string,
  limit = 60,
): Promise<MonitorRun[]> {
  if (!isMongoConfigured) return [];
  const collection = await getCollection();
  return collection
    .find({ userId })
    .sort({ at: -1 })
    .limit(limit)
    .toArray();
}

export async function getTrend(site: Site): Promise<SiteTrend> {
  const history = await getHistory(site.userId);
  return {
    userId: site.userId,
    siteName: site.siteName,
    siteUrl: site.siteUrl,
    latest: history[0] ?? null,
    previous: history[1] ?? null,
    history: [...history].reverse(),
  };
}

/**
 * What counts as worth telling someone about.
 *
 * A site that stopped responding always is. Beyond that, small wobbles are
 * noise: response time varies, and a one-point move would train everyone to
 * ignore the alerts. Five points is a real change, and a check that flipped
 * from passing to failing is a concrete thing we can name.
 */
export function describeChange(
  latest: MonitorRun | null,
  previous: MonitorRun | null,
): { level: "ok" | "warn" | "down"; message: string } | null {
  if (!latest) return null;

  if (!latest.reachable) {
    return { level: "down", message: "Die Seite war beim letzten Test nicht erreichbar." };
  }

  if (!previous) return { level: "ok", message: "Erste Messung erfasst." };

  if (!previous.reachable) {
    return { level: "ok", message: "Die Seite ist wieder erreichbar." };
  }

  const delta = latest.score - previous.score;
  const newlyFailing = latest.failing.filter(
    (id) => !previous.failing.includes(id),
  );

  if (delta <= -5 || newlyFailing.length > 0) {
    const what =
      newlyFailing.length > 0
        ? `${newlyFailing.length} ${newlyFailing.length === 1 ? "Prüfpunkt" : "Prüfpunkte"} neu auffällig`
        : `${Math.abs(delta)} Punkte schlechter`;
    return { level: "warn", message: `${what} seit der letzten Messung.` };
  }

  if (delta >= 5) {
    return { level: "ok", message: `${delta} Punkte besser als zuletzt.` };
  }

  return { level: "ok", message: "Unverändert." };
}
