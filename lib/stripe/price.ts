import { getStripe } from "./client";
import { isStripeConfigured, stripePriceId } from "./config";

export type PlanPrice = {
  /** Fertig formatiert, z. B. "CHF 14.99". */
  amount: string | null;
  /** Produktname aus Stripe, z. B. "Kundenbereich". */
  name: string;
  /**
   * Ein Abo braucht einen wiederkehrenden Preis. Ein einmaliger hat kein
   * Intervall — und darf auch keines vorgespielt bekommen: genau das hat
   * einen falsch angelegten Preis wie einen richtigen aussehen lassen,
   * während der Checkout ihn ablehnte.
   */
  recurring: boolean;
  /** Wie Stripe es nennt; unbekannte Werte werden als "month" gelesen. */
  interval: "day" | "week" | "month" | "year";
};

/**
 * Preis und Bezeichnung kommen aus Stripe statt aus dem Code.
 *
 * Ein hier fest eingetragener Betrag wäre genau einmal richtig — beim
 * nächsten Preiswechsel im Stripe-Dashboard stünde auf der Seite etwas
 * anderes, als tatsächlich abgebucht wird.
 */
/**
 * Stripe lässt in den Typen auch unbekannte Intervalle zu, damit ein neuer
 * Wert das SDK nicht bricht. Für die Anzeige ist Monat die richtige
 * Annahme — falsch beschriftet ist besser als eine leere Seite.
 */
function readInterval(interval: string | undefined): PlanPrice["interval"] {
  return interval === "day" || interval === "week" || interval === "year"
    ? interval
    : "month";
}

let cached: { value: PlanPrice | null; until: number } | undefined;

const TTL_MS = 10 * 60 * 1000;

export async function getPlanPrice(): Promise<PlanPrice | null> {
  if (!isStripeConfigured) return null;

  // Die Preisseite ist öffentlich. Ohne diesen Zwischenspeicher würde jeder
  // Seitenaufruf eine Stripe-Anfrage auslösen — langsam, und bei etwas
  // Andrang läuft man in deren Rate Limit.
  if (cached && cached.until > Date.now()) {
    return cached.value;
  }

  let value: PlanPrice | null = null;

  try {
    const price = await getStripe().prices.retrieve(stripePriceId, {
      expand: ["product"],
    });

    const product = price.product;

    value = {
      amount:
        price.unit_amount === null
          ? null
          : new Intl.NumberFormat("de-CH", {
              style: "currency",
              currency: price.currency.toUpperCase(),
            }).format(price.unit_amount / 100),
      name:
        typeof product === "object" && "name" in product
          ? product.name
          : "Kundenbereich",
      recurring: price.recurring !== null,
      interval: readInterval(price.recurring?.interval),
    };
  } catch (error) {
    // Kein Preis ist besser als ein falscher: die Seiten zeigen dann den
    // Weg über das Kontaktformular statt einer erfundenen Zahl.
    console.error("[stripe] Preis konnte nicht geladen werden:", error);
  }

  cached = { value, until: Date.now() + TTL_MS };
  return value;
}

export const intervalLabel = (interval: PlanPrice["interval"]) =>
  interval === "year"
    ? "Jahr"
    : interval === "week"
      ? "Woche"
      : interval === "day"
        ? "Tag"
        : "Monat";
