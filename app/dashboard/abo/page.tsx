import type { Metadata } from "next";
import BillingButton from "@/app/components/BillingButton";
import { getAccess } from "@/lib/billing";
import { getStripe } from "@/lib/stripe/client";
import { isStripeConfigured, stripePriceId } from "@/lib/stripe/config";
import type { SubscriptionStatus } from "@/lib/mongodb/sites";
import { openPortal, startCheckout } from "./actions";

export const metadata: Metadata = {
  title: "Abo",
  robots: { index: false, follow: false },
};

const statusLabels: Record<SubscriptionStatus, string> = {
  none: "Kein Abo",
  trialing: "Testphase",
  active: "Aktiv",
  past_due: "Zahlung offen",
  unpaid: "Zahlung offen",
  incomplete: "Nicht abgeschlossen",
  incomplete_expired: "Abgelaufen",
  paused: "Pausiert",
  canceled: "Gekündigt",
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("de-CH", { dateStyle: "long" }).format(date);

/**
 * Preis und Bezeichnung kommen aus Stripe statt aus dem Code.
 *
 * Ein hier fest eingetragener Betrag wäre genau einmal richtig — beim
 * nächsten Preiswechsel im Stripe-Dashboard stünde auf der Seite etwas
 * anderes, als tatsächlich abgebucht wird.
 */
async function loadPrice() {
  try {
    const price = await getStripe().prices.retrieve(stripePriceId, {
      expand: ["product"],
    });

    const amount =
      price.unit_amount === null
        ? null
        : new Intl.NumberFormat("de-CH", {
            style: "currency",
            currency: price.currency.toUpperCase(),
          }).format(price.unit_amount / 100);

    const product = price.product;
    const name =
      typeof product === "object" && "name" in product ? product.name : "Kundenbereich";

    return { amount, name, interval: price.recurring?.interval ?? "month" };
  } catch {
    return null;
  }
}

export default async function Abo({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const access = await getAccess();
  const { subscription } = access;

  if (!isStripeConfigured) {
    return (
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Abo</h2>
        <p className="mt-4 rounded-brand border border-border bg-surface px-4 py-3 text-sm text-muted">
          Die Zahlungsabwicklung ist noch nicht konfiguriert — sobald{" "}
          <code className="text-foreground">STRIPE_SECRET_KEY</code> und{" "}
          <code className="text-foreground">STRIPE_PRICE_ID</code> gesetzt sind,
          lässt sich das Abo hier abschliessen und verwalten. Bis dahin ist der
          Kundenbereich für alle offen.
        </p>
      </div>
    );
  }

  const price = await loadPrice();
  const hasCustomer = Boolean(subscription.customerId);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Abo</h2>
        <p className="mt-2 max-w-xl text-muted">
          Der Kundenbereich mit Inhaltspflege, Projektstatus und Auswertungen
          läuft im Monatsabo. Zahlung, Kündigung und Rechnungen laufen über
          Stripe.
        </p>
      </div>

      {status === "erfolg" && (
        <p className="rounded-brand border border-border bg-surface px-4 py-3 text-sm">
          Vielen Dank — die Zahlung ist bei Stripe eingegangen. Die
          Freischaltung erfolgt automatisch und ist in der Regel nach wenigen
          Sekunden hier sichtbar.
        </p>
      )}
      {status === "abgebrochen" && (
        <p className="rounded-brand border border-border bg-surface px-4 py-3 text-sm text-muted">
          Der Bezahlvorgang wurde abgebrochen. Es wurde nichts belastet.
        </p>
      )}

      <div className="rounded-brand border border-border bg-surface p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-medium">{price?.name ?? "Kundenbereich"}</p>
          {price?.amount && (
            <p className="text-lg font-semibold">
              {price.amount}
              <span className="text-sm font-normal text-muted">
                {price.interval === "year" ? " / Jahr" : " / Monat"}
              </span>
            </p>
          )}
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted">Status</dt>
            <dd className="mt-1 font-medium">
              {statusLabels[subscription.status]}
            </dd>
          </div>
          {subscription.currentPeriodEnd && (
            <div>
              <dt className="text-sm text-muted">
                {subscription.cancelAtPeriodEnd || subscription.status === "canceled"
                  ? "Zugang bis"
                  : "Nächste Abbuchung"}
              </dt>
              <dd className="mt-1 font-medium">
                {formatDate(subscription.currentPeriodEnd)}
              </dd>
            </div>
          )}
        </dl>

        {access.reason === "zahlung-offen" && (
          <p className="mt-6 text-sm text-accent">
            Die letzte Abbuchung ist fehlgeschlagen. Bitte hinterlegen Sie ein
            anderes Zahlungsmittel — der Zugang bleibt so lange bestehen.
          </p>
        )}
        {access.reason === "admin" && (
          <p className="mt-6 text-sm text-muted">
            Sie sind als Admin angemeldet und brauchen kein Abo.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {access.allowed && access.reason !== "admin" ? (
            <BillingButton
              action={openPortal}
              label="Abo verwalten"
              pendingLabel="Wird geöffnet…"
              variant="secondary"
            />
          ) : (
            access.reason !== "admin" && (
              <BillingButton
                action={startCheckout}
                label="Abo starten"
                pendingLabel="Weiterleitung…"
              />
            )
          )}
          {/* Wer schon einmal gezahlt hat, kommt auch nach einer Kündigung
              noch an seine Rechnungen. */}
          {!access.allowed && hasCustomer && (
            <BillingButton
              action={openPortal}
              label="Rechnungen ansehen"
              pendingLabel="Wird geöffnet…"
              variant="secondary"
            />
          )}
        </div>
      </div>
    </div>
  );
}
