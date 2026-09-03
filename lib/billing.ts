import { cache } from "react";
import { isAdminEmail } from "@/lib/admin";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { getSite, noSubscription, type Site, type SiteSubscription } from "@/lib/mongodb/sites";
import { isStripeConfigured } from "@/lib/stripe/config";
import { getCurrentUser } from "@/lib/supabase/auth";

export type Access = {
  /** Darf der Kundenbereich benutzt werden? */
  allowed: boolean;
  /** Warum — für die Anzeige auf der Abo-Seite. */
  reason:
    | "kein-abo"
    | "abo-aktiv"
    | "gekuendigt-laeuft-noch"
    | "zahlung-offen"
    | "admin"
    | "keine-schranke";
  subscription: SiteSubscription;
};

/**
 * Ein gekündigtes Abo endet nicht sofort: bezahlt ist bis
 * currentPeriodEnd. Wer bis zum letzten Tag zahlt, darf bis zum letzten
 * Tag rein.
 */
function paidThrough(subscription: SiteSubscription): boolean {
  return (
    subscription.currentPeriodEnd !== null &&
    subscription.currentPeriodEnd.getTime() > Date.now()
  );
}

export function checkSubscription(subscription: SiteSubscription): Access {
  switch (subscription.status) {
    case "active":
    case "trialing":
      return {
        allowed: true,
        reason: subscription.cancelAtPeriodEnd ? "gekuendigt-laeuft-noch" : "abo-aktiv",
        subscription,
      };

    // Eine fehlgeschlagene Zahlung ist meistens eine abgelaufene Karte,
    // kein Kündigungswunsch. Stripe versucht es über Tage erneut; jemanden
    // sofort auszusperren, statt ihn die Karte wechseln zu lassen, ist der
    // schnellste Weg, einen zahlenden Kunden zu verlieren.
    case "past_due":
    case "unpaid":
      return { allowed: true, reason: "zahlung-offen", subscription };

    // Gekündigt: der Zugang läuft mit der bezahlten Periode aus.
    case "canceled":
      return {
        allowed: paidThrough(subscription),
        reason: paidThrough(subscription) ? "gekuendigt-laeuft-noch" : "kein-abo",
        subscription,
      };

    default:
      return { allowed: false, reason: "kein-abo", subscription };
  }
}

/**
 * Die eine Stelle, an der über den Zugang zum Kundenbereich entschieden wird.
 *
 * In cache() verpackt, weil Layout, Seite und Server Action das im selben
 * Request alle wissen wollen — so bleibt es bei einer Datenbankabfrage.
 */
export const getAccess = cache(async (): Promise<Access & { site: Site | null }> => {
  const noGate = (reason: Access["reason"]) => ({
    allowed: true,
    reason,
    subscription: { ...noSubscription },
    site: null,
  });

  // Ohne Stripe- oder MongoDB-Konfiguration gibt es keine Bezahlschranke.
  // Genau wie beim Rest der App: fehlende Zugangsdaten schalten ein
  // Feature ab, statt die Seite unbenutzbar zu machen.
  if (!isStripeConfigured || !isMongoConfigured) {
    return noGate("keine-schranke");
  }

  const user = await getCurrentUser();
  if (!user) {
    return noGate("keine-schranke");
  }

  // Wir selbst zahlen nicht für unser eigenes Werkzeug.
  if (isAdminEmail(user.email)) {
    return noGate("admin");
  }

  try {
    const site = await getSite(user.id);
    return { ...checkSubscription(site.subscription), site };
  } catch {
    // Die Datenbank ist nicht erreichbar. Im Zweifel aufschliessen statt
    // zusperren: eine Datenbankstörung darf keine zahlenden Kund:innen
    // aussperren, und die Seiten dahinter melden das Problem ohnehin
    // selbst.
    return noGate("keine-schranke");
  }
});
