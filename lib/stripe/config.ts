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
