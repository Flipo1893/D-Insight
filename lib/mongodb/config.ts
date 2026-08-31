export const mongodbUri = process.env.MONGODB_URI;
export const mongodbDbName = process.env.MONGODB_DB ?? "d-insight";

// Same pattern as isSupabaseConfigured: the rest of the app checks this
// instead of crashing when the connection string is missing.
export const isMongoConfigured = Boolean(mongodbUri);
