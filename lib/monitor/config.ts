/**
 * Shared secret for the scheduled monitoring run.
 *
 * Empty means the endpoint answers 404 to everyone, including the
 * scheduler. That is deliberate: an open endpoint that makes this server
 * fetch a list of URLs on demand is an amplifier someone else can point at
 * a target.
 */
export const monitorSecret = process.env.MONITOR_SECRET ?? "";
