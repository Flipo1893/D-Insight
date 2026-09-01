"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { consentSnapshot, subscribeToConsent } from "@/lib/consent";
import { analyticsId } from "../lib/content";

/**
 * Google Analytics, loaded only after consent.
 *
 * The component returns null until the visitor has actively agreed, so the
 * script tag never reaches the document before then. That is the part most
 * implementations get wrong: they load gtag on every page and only set a
 * consent flag afterwards, by which point the request to Google has already
 * happened and the cookie is already set.
 *
 * Consent Mode is configured as denied by default anyway, as a second line
 * of defence in case this component is ever mounted differently.
 */
export default function Analytics() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    consentSnapshot,
    () => "undecided" as const,
  );

  if (!analyticsId) return null;
  if (consent !== "granted") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied'
          });
          gtag('consent', 'update', { analytics_storage: 'granted' });
          gtag('js', new Date());
          gtag('config', '${analyticsId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
