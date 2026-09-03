import { createHash } from "node:crypto";
import type { Collection } from "mongodb";
import { getMongoClientPromise } from "@/lib/mongodb/client";
import { isMongoConfigured, mongodbDbName } from "@/lib/mongodb/config";
import { createIndexGuard } from "@/lib/mongodb/indexes";
import { statsSalt } from "./config";

export type PageView = {
  path: string;
  /** Referring host only, never the full URL. */
  source: string;
  /** Daily-rotating pseudonym, see visitorHash. */
  visitor: string;
  day: string;
  at: Date;
};

export type StatsSummary = {
  totalViews: number;
  uniqueVisitors: number;
  days: { day: string; views: number; visitors: number }[];
  topPaths: { path: string; views: number }[];
  topSources: { source: string; views: number }[];
};

/**
 * Pseudonym for counting people without recognising them.
 *
 * No cookie and no stored identifier: the address and browser string are
 * hashed together with a secret and the current date, and only the hash is
 * written. It cannot be reversed, it cannot be linked across days, and it is
 * useless to anyone who reads the database. That is what keeps this out of
 * consent-banner territory, and it is the same trade every privacy-first
 * analytics tool makes: exact per-person history is given up in return for
 * not tracking anyone.
 */
export function visitorHash(ip: string, userAgent: string, day: string) {
  return createHash("sha256")
    .update(`${ip}|${userAgent}|${day}|${statsSalt}`)
    .digest("hex")
    .slice(0, 24);
}

export const today = () => new Date().toISOString().slice(0, 10);

const ensureIndexes = createIndexGuard<PageView>((collection) =>
  Promise.all([
    collection.createIndex({ day: 1 }),
    // Views expire after a year. Analytics nobody looks at is just a
    // liability sitting in a database.
    //
    // There is deliberately no second, plain index on { at: 1 }: MongoDB
    // refuses two indexes on the same key with different names or options,
    // so requesting both made whichever lost the race throw
    // IndexOptionsConflict. A TTL index is an ordinary single-field index
    // that also carries an expiry, so it already serves the range queries
    // on `at` below.
    collection.createIndex(
      { at: 1 },
      { expireAfterSeconds: 60 * 60 * 24 * 365, name: "at_ttl" },
    ),
  ]),
);

async function getCollection(): Promise<Collection<PageView>> {
  const client = await getMongoClientPromise();
  const collection = client.db(mongodbDbName).collection<PageView>("pageviews");

  await ensureIndexes(collection);

  return collection;
}

export async function recordView(view: Omit<PageView, "at">) {
  if (!isMongoConfigured) return;
  const collection = await getCollection();
  await collection.insertOne({ ...view, at: new Date() });
}

export async function getSummary(days = 30): Promise<StatsSummary | null> {
  if (!isMongoConfigured) return null;

  const collection = await getCollection();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [byDay, byPath, bySource, uniques, total] = await Promise.all([
    collection
      .aggregate<{ _id: string; views: number; visitors: string[] }>([
        { $match: { at: { $gte: since } } },
        {
          $group: {
            _id: "$day",
            views: { $sum: 1 },
            visitors: { $addToSet: "$visitor" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray(),
    collection
      .aggregate<{ _id: string; views: number }>([
        { $match: { at: { $gte: since } } },
        { $group: { _id: "$path", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 8 },
      ])
      .toArray(),
    collection
      .aggregate<{ _id: string; views: number }>([
        { $match: { at: { $gte: since } } },
        { $group: { _id: "$source", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 8 },
      ])
      .toArray(),
    collection.distinct("visitor", { at: { $gte: since } }),
    collection.countDocuments({ at: { $gte: since } }),
  ]);

  return {
    totalViews: total,
    uniqueVisitors: uniques.length,
    days: byDay.map((entry) => ({
      day: entry._id,
      views: entry.views,
      visitors: entry.visitors.length,
    })),
    topPaths: byPath.map((entry) => ({ path: entry._id, views: entry.views })),
    topSources: bySource.map((entry) => ({
      source: entry._id,
      views: entry.views,
    })),
  };
}
