import { isAdminEmail } from "@/lib/admin";

/**
 * Was von einem fehlgeschlagenen Stripe-Aufruf im Formular landet.
 *
 * Zwei Adressaten, zwei Texte. Kund:innen können an einer falsch gesetzten
 * Preis-ID nichts ändern, für sie ist die technische Meldung nur
 * beunruhigend. Uns dagegen kostet ein verschluckter Grund eine halbe
 * Stunde Suche im Log — deshalb sehen Admins die Ursache direkt im
 * Formular, alle anderen den freundlichen Satz.
 */
export function describeStripeFailure(
  error: unknown,
  email: string | undefined | null,
  fallback: string,
): string {
  const detail = readable(error);

  if (detail && isAdminEmail(email)) {
    return `${fallback} (nur für Admins sichtbar: ${detail})`;
  }

  return fallback;
}

/**
 * Die Fehler, die beim Einrichten tatsächlich vorkommen, in Klartext. Alles
 * andere fällt auf die Meldung von Stripe zurück, die für uns brauchbar ist.
 */
function readable(error: unknown): string | null {
  if (typeof error !== "object" || error === null) return null;

  const { code, message, param, type } = error as Record<string, unknown>;

  if (code === "resource_missing" && param === "price") {
    return "Diese Preis-ID existiert in diesem Modus nicht — Test- und Live-Preise sind getrennt, hier sind wahrscheinlich Schlüssel und Preis aus verschiedenen Modi gemischt.";
  }

  if (typeof message === "string" && message.includes("one-time price")) {
    return "Der Preis ist einmalig, nicht wiederkehrend. Für ein Abo braucht es in Stripe einen Preis mit \"Recurring\".";
  }

  if (
    typeof message === "string" &&
    message.includes("No configuration provided")
  ) {
    return "Das Kundenportal ist im Stripe-Dashboard noch nicht eingerichtet (Settings → Billing → Customer portal einmal speichern).";
  }

  if (typeof message === "string" && message.trim()) {
    return typeof type === "string" ? `${type}: ${message}` : message;
  }

  return null;
}
