"use client";

import { useSyncExternalStore } from "react";
import { consentSnapshot, resetConsent, subscribeToConsent } from "@/lib/consent";
import { analyticsId } from "../lib/content";

/**
 * Footer entry for changing a cookie decision.
 *
 * Consent has to be withdrawable as easily as it was given. A choice that
 * can only be made once, or that requires clearing browser storage by hand,
 * is not valid consent.
 *
 * Shows the current state rather than a generic label, so someone can see
 * what they decided without having to click to find out.
 */
export default function ConsentReset() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    consentSnapshot,
    () => "undecided" as const,
  );

  if (!analyticsId) return null;
  if (consent === "undecided") return null;

  return (
    <button
      type="button"
      onClick={resetConsent}
      className="-my-2 py-2 text-left transition-colors hover:text-foreground"
    >
      Cookies: {consent === "granted" ? "erlaubt" : "abgelehnt"}
      <span className="sr-only">, Auswahl ändern</span>
    </button>
  );
}
