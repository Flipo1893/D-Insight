/**
 * Hands the URL someone just checked over to the contact form.
 *
 * Without this, a visitor sees five red findings, clicks through to the
 * form, and has to type their address a second time. sessionStorage rather
 * than a query parameter, because the URL is the visitor's own site and does
 * not belong in a shareable link or in server logs.
 */
export const CHECKED_URL_KEY = "d-insight:checked-url";
export const CHECKED_URL_EVENT = "d-insight:checked-url";

export function rememberCheckedUrl(url: string) {
  try {
    sessionStorage.setItem(CHECKED_URL_KEY, url);
    window.dispatchEvent(new CustomEvent(CHECKED_URL_EVENT, { detail: url }));
  } catch {
    // Private browsing can refuse storage. Prefilling is a convenience, so
    // failing here should never stop the visitor reaching the form.
  }
}

export function readCheckedUrl(): string {
  try {
    return sessionStorage.getItem(CHECKED_URL_KEY) ?? "";
  } catch {
    return "";
  }
}

/** Subscription side of the store the contact form reads. */
export function subscribeToCheckedUrl(onChange: () => void) {
  window.addEventListener(CHECKED_URL_EVENT, onChange);
  return () => window.removeEventListener(CHECKED_URL_EVENT, onChange);
}
