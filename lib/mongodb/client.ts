import { MongoClient } from "mongodb";
import { isMongoConfigured, mongodbUri } from "./config";

// Standard Next.js + MongoDB pattern: cache the connection on `globalThis` in
// development so hot-reload doesn't open a fresh connection on every save.
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

const options = {
  // The driver waits 30s by default, which leaves a page hanging before it
  // finally errors. Fail fast enough to show a message instead.
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000,
};

function connect(): Promise<MongoClient> {
  // `promise` deliberately refers to the promise *after* .catch(), because
  // that is the one stored in the caches below — comparing against the
  // pre-catch promise would never match. The callback runs asynchronously,
  // so the binding is initialised by the time it reads it.
  const promise: Promise<MongoClient> = new MongoClient(mongodbUri!, options)
    .connect()
    .catch((error) => {
      // Without this, a connection that failed once stays cached as a
      // rejected promise and every later request replays that failure —
      // even after the network or Atlas is reachable again.
      if (global._mongoClientPromise === promise) {
        global._mongoClientPromise = undefined;
      }
      if (clientPromise === promise) {
        clientPromise = undefined;
      }
      throw error;
    });

  return promise;
}

// Only call this after checking isMongoConfigured — it throws otherwise.
export function getMongoClientPromise(): Promise<MongoClient> {
  if (!isMongoConfigured) {
    throw new Error("MongoDB ist nicht konfiguriert (MONGODB_URI fehlt).");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = connect();
    }
    clientPromise = global._mongoClientPromise;
  } else if (!clientPromise) {
    clientPromise = connect();
  }

  return clientPromise;
}
