/**
 * Who counts as a D-Insight admin (sees the "Kunden" tab and can configure
 * customer sites). Comma-separated list in .env.local, server-only — no
 * NEXT_PUBLIC_ prefix, so it never reaches the browser.
 */
const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) {
    return false;
  }

  return adminEmails.includes(email.toLowerCase());
}
