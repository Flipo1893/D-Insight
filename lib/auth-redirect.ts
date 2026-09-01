/**
 * Only same-site paths may be used as a post-login destination. Without this
 * check an attacker could send someone to /login?next=https://evil.example
 * and the app would happily bounce them off-site after a successful sign-in.
 */
export function safeNext(value: string | null | undefined): string {
  if (!value) return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}
