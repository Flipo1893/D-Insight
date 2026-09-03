"use server";

import { redirect } from "next/navigation";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { getSite, rememberStripeCustomer } from "@/lib/mongodb/sites";
import { getStripe } from "@/lib/stripe/client";
import { describeStripeFailure } from "@/lib/stripe/errors";
import { getPlanPrice } from "@/lib/stripe/price";
import { isStripeConfigured, stripePriceId } from "@/lib/stripe/config";
import { getCurrentUser } from "@/lib/supabase/auth";
import { siteUrl } from "@/lib/supabase/config";

export type BillingActionState = {
  error: string | null;
};

const notConfigured: BillingActionState = {
  error:
    "Die Zahlungsabwicklung ist noch nicht konfiguriert. Bitte STRIPE_SECRET_KEY und STRIPE_PRICE_ID in .env.local setzen.",
};

const sessionExpired: BillingActionState = {
  error: "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.",
};

/**
 * Sorgt dafür, dass ein Konto genau eine Stripe-Kundennummer hat.
 *
 * Ohne das bekäme jemand beim zweiten Abo eine zweite Kundennummer, und
 * seine Rechnungen wären auf zwei Konten verteilt — im Kundenportal sieht
 * er dann nur die Hälfte davon.
 */
async function ensureCustomer(userId: string, email: string): Promise<string> {
  const site = await getSite(userId);
  if (site.subscription.customerId) {
    return site.subscription.customerId;
  }

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  await rememberStripeCustomer(userId, customer.id);
  return customer.id;
}

export async function startCheckout(): Promise<BillingActionState> {
  if (!isStripeConfigured) return notConfigured;
  if (!isMongoConfigured) {
    return {
      error: "MongoDB ist noch nicht konfiguriert — ohne Datenbank lässt sich kein Abo speichern.",
    };
  }

  const user = await getCurrentUser();
  if (!user?.email) return sessionExpired;

  // Vor dem Checkout, nicht danach: Stripe lehnt mode=subscription mit einem
  // einmaligen Preis ab, und die Meldung dafür ist für niemanden lesbar.
  const price = await getPlanPrice();
  if (price && !price.recurring) {
    return {
      error: describeStripeFailure(
        { message: "one-time price" },
        user.email,
        "Das Abo ist nicht korrekt eingerichtet. Bitte melden Sie sich bei uns.",
      ),
    };
  }

  let checkoutUrl: string | null = null;

  try {
    const stripe = getStripe();
    const customerId = await ensureCustomer(user.id, user.email);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      // Beides, weil beides gebraucht wird: client_reference_id am
      // Checkout für die Zuordnung der Sitzung, die Metadaten am Abo
      // selbst, damit spätere Ereignisse (Kündigung, geplatzte Zahlung)
      // ohne Umweg über die Kundennummer zum Konto führen.
      client_reference_id: user.id,
      subscription_data: { metadata: { userId: user.id } },
      line_items: [{ price: stripePriceId, quantity: 1 }],
      allow_promotion_codes: true,
      // Ueber einen eigenen Endpunkt statt direkt aufs Dashboard: der
      // holt den Abo-Status sofort, statt auf den Webhook zu warten.
      success_url: `${siteUrl}/api/stripe/return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/dashboard/abo?status=abgebrochen`,
    });

    checkoutUrl = session.url;
  } catch (error) {
    console.error("[stripe] Checkout konnte nicht gestartet werden:", error);
    return {
      error: describeStripeFailure(
        error,
        user.email,
        "Die Zahlungsseite konnte nicht geöffnet werden. Bitte versuchen Sie es in einem Moment erneut.",
      ),
    };
  }

  if (!checkoutUrl) {
    return { error: "Stripe hat keine Zahlungsseite zurückgegeben." };
  }

  // Ausserhalb des try: redirect() arbeitet mit einer geworfenen Ausnahme,
  // die der catch-Block sonst als Fehler behandeln würde.
  redirect(checkoutUrl);
}

/**
 * Öffnet das Stripe-Kundenportal: Zahlungsmittel wechseln, kündigen,
 * Rechnungen herunterladen. Das alles selbst zu bauen wäre Wochen Arbeit
 * für etwas, das Stripe mitliefert.
 */
export async function openPortal(): Promise<BillingActionState> {
  if (!isStripeConfigured) return notConfigured;

  const user = await getCurrentUser();
  if (!user?.email) return sessionExpired;

  let portalUrl: string | null = null;

  try {
    const site = await getSite(user.id);
    if (!site.subscription.customerId) {
      return { error: "Für dieses Konto ist noch kein Abo hinterlegt." };
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: site.subscription.customerId,
      return_url: `${siteUrl}/dashboard/abo`,
    });

    portalUrl = session.url;
  } catch (error) {
    // Häufigster Grund beim ersten Mal: das Kundenportal ist im
    // Stripe-Dashboard noch nicht eingerichtet.
    console.error("[stripe] Kundenportal konnte nicht geöffnet werden:", error);
    return {
      error: describeStripeFailure(
        error,
        user.email,
        "Das Kundenportal konnte nicht geöffnet werden. Bitte versuchen Sie es in einem Moment erneut.",
      ),
    };
  }

  redirect(portalUrl);
}
