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

// Shown until a customer saves their own version for the first time.
const defaultFields: WebsiteContentFields = {
  heroTitle: "Ihre Website. Neu gedacht.",
  heroSubtitle:
    "Kurzer Text, der Besucherinnen und Besuchern sofort zeigt, worum es auf Ihrer Website geht.",
  aboutText: "Erzählen Sie hier kurz, wer Sie sind und was Sie besonders macht.",
};

async function getCollection() {
  const client = await getMongoClientPromise();
  return client.db(mongodbDbName).collection<WebsiteContent>("websites");
}

export async function getWebsiteContent(userId: string): Promise<WebsiteContent> {
  const collection = await getCollection();
  const doc = await collection.findOne({ userId });

  if (doc) {
    return doc;
  }

  return { userId, updatedAt: new Date(), ...defaultFields };
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
