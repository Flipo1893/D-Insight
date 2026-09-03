import type { Metadata } from "next";
import Link from "next/link";
import BillingButton from "@/app/components/BillingButton";
import { planFeatures } from "@/app/lib/content";
import { checkSubscription, getAccess } from "@/lib/billing";
import { isStripeConfigured } from "@/lib/stripe/config";
import { getPlanPrice, intervalLabel } from "@/lib/stripe/price";
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

  const price = await getPlanPrice();
  const hasCustomer = Boolean(subscription.customerId);
  // Nicht access.allowed, sondern das tatsächliche Abo: für Admins ist
  // allowed immer true, und die brauchen trotzdem den Kaufknopf — sonst gibt
  // es keinen Weg, den Ablauf zu testen, den Kund:innen durchlaufen.
  const hasLiveSubscription = checkSubscription(subscription).allowed;

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
              {price.recurring && (
                <span className="text-sm font-normal text-muted">
                  {" "}
                  / {intervalLabel(price.interval)}
                </span>
              )}
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

        {!hasLiveSubscription && (
          <ul className="mt-6 flex flex-col gap-2 border-t border-border pt-6">
            {planFeatures.map((feature) => (
              <li key={feature} className="flex gap-3 text-sm text-muted">
                <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-accent" />
                <span className="leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {price && !price.recurring && (
          <p className="mt-6 text-sm text-accent">
            Dieser Preis ist in Stripe als einmalige Zahlung angelegt. Ein Abo
            braucht einen Preis mit &quot;Recurring&quot; — der Checkout wird
            ihn sonst ablehnen.
          </p>
        )}
        {access.reason === "zahlung-offen" && (
          <p className="mt-6 text-sm text-accent">
            Die letzte Abbuchung ist fehlgeschlagen. Bitte hinterlegen Sie ein
            anderes Zahlungsmittel — der Zugang bleibt so lange bestehen.
          </p>
        )}
        {access.reason === "admin" && (
          <p className="mt-6 text-sm text-muted">
            Sie sind als Admin angemeldet und haben den Kundenbereich frei
            —{" "}
            {hasLiveSubscription
              ? "dieses Abo läuft zusätzlich und kann jederzeit gekündigt werden."
              : "der Knopf unten führt trotzdem in den Checkout, damit sich der Ablauf testen lässt."}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-start gap-3">
          {hasLiveSubscription ? (
            <BillingButton
              action={openPortal}
              label="Abo verwalten"
              pendingLabel="Wird geöffnet…"
              variant="secondary"
            />
          ) : (
            <BillingButton
              action={startCheckout}
              label="Abo starten"
              pendingLabel="Weiterleitung…"
            />
          )}
          {/* Wer schon einmal gezahlt hat, kommt auch nach einer Kündigung
              noch an seine Rechnungen. */}
          {!hasLiveSubscription && hasCustomer && (
            <BillingButton
              action={openPortal}
              label="Rechnungen ansehen"
              pendingLabel="Wird geöffnet…"
              variant="secondary"
            />
          )}
        </div>
      </div>

      <p className="text-sm text-muted">
        Preise und Leistungsumfang stehen auch öffentlich auf{" "}
        <Link href="/preise" className="text-accent-text hover:underline">
          der Preisseite
        </Link>
        .
      </p>
    </div>
  );
}
