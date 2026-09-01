/*
 * Admin membership lives in lib/admin.ts on this branch. Reusing it rather
 * than shipping a second allowlist keeps one answer to "who is an admin",
 * which is exactly the kind of thing that goes wrong when it is defined
 * twice.
 */

/**
 * Extra salt for the daily visitor hash. Without it the hash of an address
 * could be recomputed by anyone who knows the scheme, which would make it
 * personal data again.
 */
export const statsSalt = process.env.STATS_SALT ?? "";
