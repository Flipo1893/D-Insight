import { randomBytes } from "node:crypto";
import type { Collection } from "mongodb";
import { getMongoClientPromise } from "@/lib/mongodb/client";
import { isMongoConfigured, mongodbDbName } from "@/lib/mongodb/config";
import type { CheckReport } from "./analyse";

export type StoredReport = {
  id: string;
  report: CheckReport;
  rival: CheckReport | null;
  createdAt: Date;
};

/**
 * Shared quick-check reports.
 *
 * Only ever written from a report this server just computed. Accepting a
 * report body from the browser would let anyone publish arbitrary content
 * under our domain, which is a defacement vector dressed up as a feature.
 *
 * The id is random rather than sequential: a report contains someone else's
 * address and findings, so /check/1 must not lead to /check/2. Anyone with
 * the link can read it, which is the point of sharing, and the privacy page
 * says so.
 */
const TTL_DAYS = 30;

let indexReady: Promise<unknown> | undefined;

async function getCollection(): Promise<Collection<StoredReport>> {
  const client = await getMongoClientPromise();
  const collection = client
    .db(mongodbDbName)
    .collection<StoredReport>("checkreports");

  indexReady ??= Promise.all([
    collection.createIndex({ id: 1 }, { unique: true }),
    // Reports are a conversation starter, not an archive. They expire so
    // someone's findings do not sit on our server indefinitely.
    collection.createIndex(
      { createdAt: 1 },
      { expireAfterSeconds: 60 * 60 * 24 * TTL_DAYS, name: "createdAt_ttl" },
    ),
  ]);
  await indexReady;

  return collection;
}

/** 12 characters of base36 from a real random source, not Math.random. */
function makeId(): string {
  return [...randomBytes(9)]
    .map((byte) => byte.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 12);
}

export async function saveReport(
  report: CheckReport,
  rival: CheckReport | null,
): Promise<string | null> {
  if (!isMongoConfigured) return null;

  const collection = await getCollection();
  const id = makeId();
  await collection.insertOne({ id, report, rival, createdAt: new Date() });
  return id;
}

export async function loadReport(id: string): Promise<StoredReport | null> {
  if (!isMongoConfigured) return null;
  if (!/^[a-z0-9]{1,24}$/.test(id)) return null;

  const collection = await getCollection();
  return collection.findOne({ id });
}

export const reportTtlDays = TTL_DAYS;
