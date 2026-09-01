export const mongodbUri = process.env.MONGODB_URI;
export const mongodbDbName = process.env.MONGODB_DB ?? "d-insight";

/** Same pattern as isSupabaseConfigured: check instead of crashing. */
export const isMongoConfigured = Boolean(mongodbUri);
