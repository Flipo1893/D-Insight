import type Stripe from "stripe";
import type { SiteSubscription, SubscriptionStatus } from "@/lib/mongodb/sites";

/**
 * Übersetzt ein Stripe-Abo in das, was wir davon speichern.
 *
 * Geteilt zwischen Webhook und Rückkehr aus dem Checkout, damit beide Wege
 * denselben Zustand schreiben.
 */
export function toSiteSubscription(
  subscription: Stripe.Subscription,
): SiteSubscription {
  // Seit API-Version 2025-03-31 hängt der Periodenwechsel an den Positionen
  // des Abos, nicht mehr am Abo selbst. Wer hier subscription.current_period_end
  // liest, bekommt undefined — und damit einen Zugang, der nie ausläuft.
  const item = subscription.items.data[0];

  return {
    customerId:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id,
    subscriptionId: subscription.id,
    status: subscription.status as SubscriptionStatus,
    priceId: item?.price.id ?? "",
    currentPeriodEnd: item?.current_period_end
      ? new Date(item.current_period_end * 1000)
      : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: new Date(),
  };
}
