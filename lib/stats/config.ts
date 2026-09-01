/**
 * Who may open the statistics console.
 *
 * An allowlist of addresses rather than a role column: there are two of you,
 * the list changes roughly never, and a env var cannot be granted to someone
 * by accident through a signup form the way a database flag can.
 *
 * Set ADMIN_EMAILS in .env.local, comma separated. Server-side only, so the
 * list never reaches the browser.
 */
export const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean);

export const hasAdmins = adminEmails.length > 0;

export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  return adminEmails.includes(email.trim().toLowerCase());
}

/**
 * Extra salt for the daily visitor hash. Without it the hash of an address
 * could be recomputed by anyone who knows the scheme, which would make it
 * personal data again.
 */
export const statsSalt = process.env.STATS_SALT ?? "";
