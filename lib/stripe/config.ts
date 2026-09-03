/**
 * Stripe-Zugangsdaten. Gleiche Idee wie bei Supabase und MongoDB: fehlen
 * sie, bleibt die App voll benutzbar — nur die Bezahlschranke ist dann aus,
 * und das Dashboard verhält sich wie vorher.
 *
 * Alles server-only, kein NEXT_PUBLIC_. Der Secret Key darf den Browser
 * niemals erreichen; die Checkout-Session wird deshalb in einer Server
 * Action erzeugt und der Browser bekommt nur die fertige Weiterleitungs-URL.
 */
export const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? "";
export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

/** Preis-ID des monatlichen Abos, aus dem Stripe-Dashboard (beginnt mit price_). */
export const stripePriceId = process.env.STRIPE_PRICE_ID ?? "";

/**
 * Ohne Secret Key und Preis gibt es nichts zu verkaufen. Der Webhook-Secret
 * ist absichtlich nicht Teil dieser Prüfung: er wird nur vom Webhook selbst
 * gebraucht, und der weist ohne ihn ohnehin jede Anfrage ab.
 */
export const isStripeConfigured = Boolean(stripeSecretKey && stripePriceId);

/**
 * Welche der beiden Variablen fehlt — und ob der Wert wenigstens plausibel
 * aussieht.
 *
 * "Nicht konfiguriert, bitte STRIPE_SECRET_KEY und STRIPE_PRICE_ID setzen"
 * beantwortet die Frage nicht, die man in dem Moment hat: welche von beiden
 * denn. Und ein Preis, der mit sk_ beginnt, ist ein vertauschtes
 * Copy-Paste, kein fehlender Wert.
 */
export function describeStripeConfig(): string[] {
  const problems: string[] = [];

  if (!stripeSecretKey) {
    problems.push("STRIPE_SECRET_KEY fehlt.");
  } else if (!/^(sk|rk)_(test|live)_/.test(stripeSecretKey)) {
    problems.push(
      "STRIPE_SECRET_KEY sieht nicht nach einem Stripe-Schlüssel aus (erwartet sk_test_…, sk_live_… oder rk_…).",
    );
  }

  if (!stripePriceId) {
    problems.push("STRIPE_PRICE_ID fehlt.");
  } else if (!stripePriceId.startsWith("price_")) {
    problems.push(
      "STRIPE_PRICE_ID beginnt nicht mit price_ — das ist die ID des Preises, nicht die des Produkts (prod_…).",
    );
  }

  return problems;
}
