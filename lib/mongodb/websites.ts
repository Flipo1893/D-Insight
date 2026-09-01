import type { Collection } from "mongodb";
import { getMongoClientPromise } from "./client";
import { mongodbDbName } from "./config";

export type WebsiteContentFields = {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
};

export type WebsiteContent = WebsiteContentFields & {
  userId: string;
  updatedAt: Date;
};

/** Shown until a customer saves their own version for the first time. */
export const defaultFields: WebsiteContentFields = {
  heroTitle: "Ihre Website. Neu gedacht.",
  heroSubtitle:
    "Kurzer Text, der Besucherinnen und Besuchern sofort zeigt, worum es auf Ihrer Website geht.",
  aboutText: "Erzählen Sie hier kurz, wer Sie sind und was Sie besonders macht.",
};

/** Every query filters on userId, so it needs an index to stay fast. */
let indexReady: Promise<unknown> | undefined;

async function getCollection(): Promise<Collection<WebsiteContent>> {
  const client = await getMongoClientPromise();
  const collection = client
    .db(mongodbDbName)
    .collection<WebsiteContent>("websites");

  // createIndex is idempotent, and caching the promise keeps it to one
  // round-trip per process rather than one per request.
  indexReady ??= collection.createIndex({ userId: 1 }, { unique: true });
  await indexReady;

  return collection;
}

export async function getWebsiteContent(
  userId: string,
): Promise<WebsiteContent> {
  const collection = await getCollection();
  const doc = await collection.findOne({ userId });
  return doc ?? { userId, updatedAt: new Date(), ...defaultFields };
}

export async function saveWebsiteContent(
  userId: string,
  fields: WebsiteContentFields,
): Promise<void> {
  const collection = await getCollection();
  await collection.updateOne(
    { userId },
    { $set: { ...fields, updatedAt: new Date() } },
    { upsert: true },
  );
}
