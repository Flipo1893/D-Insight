import { MongoClient } from "mongodb";
import { isMongoConfigured, mongodbUri } from "./config";

// Standard Next.js pattern: cache the connection on globalThis in
// development so hot reload does not open a fresh pool on every save.
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

/** Only call after checking isMongoConfigured; it throws otherwise. */
export function getMongoClientPromise(): Promise<MongoClient> {
  if (!isMongoConfigured) {
    throw new Error("MongoDB ist nicht konfiguriert (MONGODB_URI fehlt).");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(mongodbUri!).connect();
    }
    clientPromise = global._mongoClientPromise;
  } else if (!clientPromise) {
    clientPromise = new MongoClient(mongodbUri!).connect();
  }

  return clientPromise;
}
