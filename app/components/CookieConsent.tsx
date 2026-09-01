"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  consentSnapshot,
  subscribeToConsent,
  writeConsent,
} from "@/lib/consent";
import { analyticsId } from "../lib/content";

/**
 * Consent banner.
 *
 * Only rendered when there is actually something to consent to. With no
 * analytics id configured the site sets no cookies and loads nothing
 * external, so asking would be theatre, and a banner nobody needs trains
 * people to click away banners they do need.
 *
 * Both buttons are the same size and weight on purpose. Making "reject"
 * quieter than "accept" is the most common way consent banners fail: under
 * the GDPR consent has to be freely given, and a nudged choice is not free.
 */
export default function CookieConsent() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    consentSnapshot,
    () => "undecided" as const,
  );

  if (!analyticsId) return null;
  if (consent !== "undecided") return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-[var(--z-overlay)] border-t border-border bg-background/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="min-w-0">
          <p id="consent-title" className="font-semibold">
            Dürfen wir messen, wie diese Seite genutzt wird?
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Wir würden dafür Google Analytics einsetzen. Das setzt Cookies und
            überträgt Daten in die USA. Ohne Ihre Zustimmung passiert nichts
            davon, und die Seite funktioniert vollständig.{" "}
            <Link
              href="/datenschutz"
              className="text-muted-strong underline transition-colors hover:text-accent-text"
            >
              Datenschutz
            </Link>
          </p>
        </div>

        {/* Same size, same weight, same order of importance. */}
        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={() => writeConsent("denied")}
            className="rounded-brand border border-border px-6 py-3 text-sm font-semibold whitespace-nowrap transition-colors hover:border-border-strong"
          >
            Ablehnen
          </button>
          <button
            type="button"
            onClick={() => writeConsent("granted")}
            className="rounded-brand border border-border px-6 py-3 text-sm font-semibold whitespace-nowrap transition-colors hover:border-border-strong"
          >
            Einverstanden
          </button>
        </div>
      </div>
    </div>
  );
}
