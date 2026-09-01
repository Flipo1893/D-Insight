/**
 * Cookie consent.
 *
 * The rules that actually matter and that this implements:
 * - Nothing that needs consent may load before consent is given. Loading
 *   first and asking after is the single most common violation.
 * - Rejecting has to be as easy as accepting. One click each, same size,
 *   same prominence. A grey "Ablehnen" next to a big green "Alle
 *   akzeptieren" is a dark pattern and does not count as free consent.
 * - Consent must be withdrawable as easily as it was given, so there is a
 *   permanent entry in the footer.
 * - Silence is not consent. No choice means no tracking.
 *
 * Stored in localStorage rather than in a cookie: the choice never needs to
 * reach the server, and a consent cookie that itself needs consent is a
 * circular problem best avoided.
 */

export type ConsentValue = "granted" | "denied";

export type ConsentState = {
  /** Anything beyond what the site needs to function. */
  analytics: ConsentValue;
  /** When the choice was made, so an old consent can be re-asked later. */
  decidedAt: string;
  /** Version of the text the visitor agreed to. */
  version: number;
};

export const CONSENT_KEY = "d-insight:consent";
export const CONSENT_EVENT = "d-insight:consent";

/**
 * Raise this when the categories or the services behind them change. An
 * older stored choice is then treated as no choice, and the visitor is asked
 * again, because they never agreed to whatever was added.
 */
export const CONSENT_VERSION = 1;

export function readConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (parsed.analytics !== "granted" && parsed.analytics !== "denied") {
      return null;
    }
    return parsed;
  } catch {
    // Private mode, disabled storage, corrupted value: treat as undecided,
    // which means nothing loads. Failing closed is the safe direction here.
    return null;
  }
}

export function writeConsent(analytics: ConsentValue) {
  const state: ConsentState = {
    analytics,
    decidedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  } catch {
    // If it cannot be stored the visitor is asked again next time, which is
    // annoying but never wrong.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}

/** Clears the choice so the banner reappears. Used by the footer entry. */
export function resetConsent() {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    // Nothing to do; the banner shows anyway when no choice can be read.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}

export function subscribeToConsent(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  // Another tab may decide for the same person.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Snapshot for useSyncExternalStore. Returns a stable string, not an object. */
export function consentSnapshot(): "granted" | "denied" | "undecided" {
  const state = readConsent();
  return state ? state.analytics : "undecided";
}
