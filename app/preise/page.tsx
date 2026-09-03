import type { Metadata } from "next";
import Link from "next/link";
import BillingButton from "../components/BillingButton";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { startCheckout } from "../dashboard/abo/actions";
import { planFeatures, primaryCta, site } from "../lib/content";
import { checkSubscription, getAccess } from "@/lib/billing";
import { getPlanPrice, intervalLabel } from "@/lib/stripe/price";
import { isStripeConfigured } from "@/lib/stripe/config";
import { getCurrentUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Preise",
  description:
    "Das Refactoring wird individuell kalkuliert, der Kundenbereich läuft im Monatsabo. Was drin ist, was es kostet und wie die Kündigung funktioniert.",
  alternates: { canonical: "/preise" },
};

/**
 * Der Knopf, der zum Abo führt — und zwar aus jedem Zustand heraus.
 *
 * Vorher war das Abo nur aus dem Kundenbereich erreichbar, also erst nach
 * einer Registrierung. Wer den Preis wissen wollte, musste sich anmelden,
 * und wer angemeldet war, sah als Admin gar keinen Knopf. Beides endete im
 * Nichts, deshalb entscheidet diese Stelle anhand des Zustands.
 */
async function PlanCta() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex flex-col gap-3">
        <Link
          href="/registrieren"
          className="rounded-brand bg-accent px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Konto erstellen und starten
        </Link>
        <p className="text-sm text-muted">
          Schon registriert?{" "}
          <Link href="/login" className="text-accent-text hover:underline">
            Anmelden
          </Link>
        </p>
      </div>
    );
  }

  const access = await getAccess();

  // Das tatsächliche Abo entscheidet, nicht access.allowed: für Admins ist
  // das immer true, und die sollen den Ablauf testen können.
  if (checkSubscription(access.subscription).allowed) {
    return (
      <Link
        href="/dashboard/abo"
        className="rounded-brand border border-border px-6 py-3 text-center text-sm font-semibold transition-colors hover:bg-surface"
      >
        Abo verwalten
      </Link>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <BillingButton
        action={startCheckout}
        label="Abo starten"
        pendingLabel="Weiterleitung…"
      />
      {access.reason === "admin" && (
        <p className="text-sm text-muted">
          Als Admin haben Sie den Kundenbereich ohnehin frei — der Knopf führt
          trotzdem in den Checkout, damit sich der Ablauf testen lässt.
        </p>
      )}
    </div>
  );
}

export default async function Preise() {
  const price = await getPlanPrice();

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          eyebrow="Preise"
          title="Ein fixes Angebot, danach ein Abo, das man kündigen kann"
          description="Das Refactoring kalkulieren wir pro Projekt — nach der Analyse, mit festem Preis. Der Kundenbereich danach kostet monatlich und ist optional."
        />

        <section className="mx-auto max-w-6xl px-6 pb-24 xl:max-w-7xl 2xl:max-w-[1440px]">
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Das Projekt zuerst: das ist die Leistung, wegen der jemand
                hier ist. Das Abo ist die Fortsetzung, nicht der Einstieg. */}
            <Reveal>
              <article className="flex h-full flex-col rounded-brand border border-border bg-surface p-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                  Projekt
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Refactoring
                </h2>
                <p className="mt-4 text-3xl font-semibold tracking-tight">
                  Individuell
                </p>
                <p className="mt-2 text-sm text-muted">
                  Fixpreis nach der Analyse, keine offene Stundenrechnung.
                </p>

                <p className="mt-6 leading-relaxed text-muted">
                  Redesign, technisches Refactoring und KI-SEO — je nach
                  Ausgangslage einer oder alle drei Bausteine. Was ein Projekt
                  kostet, hängt vom Umfang Ihrer Website ab, deshalb steht hier
                  keine Zahl, die für Sie ohnehin nicht stimmen würde.
                </p>

                <div className="mt-8 flex flex-col gap-3 pt-2">
                  <Link
                    href="/#kontakt"
                    className="rounded-brand bg-accent px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                  >
                    {primaryCta}
                  </Link>
                  <p className="text-sm text-muted">
                    Unverbindlich, Antwort in der Regel am gleichen Tag.
                  </p>
                </div>
              </article>
            </Reveal>

            <Reveal index={1}>
              <article className="flex h-full flex-col rounded-brand border border-accent/40 bg-surface p-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                  Laufend
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  {price?.name ?? "Kundenbereich"}
                </h2>

                {price?.amount ? (
                  <p className="mt-4 text-3xl font-semibold tracking-tight">
                    {price.amount}
                    <span className="text-base font-normal text-muted">
                      {" "}
                      / {intervalLabel(price.interval)}
                    </span>
                  </p>
                ) : (
                  <p className="mt-4 text-3xl font-semibold tracking-tight">
                    Auf Anfrage
                  </p>
                )}
                <p className="mt-2 text-sm text-muted">
                  Monatlich kündbar, keine Mindestlaufzeit.
                </p>

                <ul className="mt-6 flex flex-col gap-3">
                  {planFeatures.map((feature) => (
                    <li key={feature} className="flex gap-3 text-muted">
                      <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-accent" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col gap-3 pt-2">
                  {isStripeConfigured ? (
                    <PlanCta />
                  ) : (
                    <>
                      <Link
                        href="/#kontakt"
                        className="rounded-brand border border-border px-6 py-3 text-center text-sm font-semibold transition-colors hover:bg-surface"
                      >
                        Nach dem Kundenbereich fragen
                      </Link>
                      <p className="text-sm text-muted">
                        Die Online-Zahlung ist gerade nicht verfügbar — melden
                        Sie sich, wir richten den Zugang von Hand ein.
                      </p>
                    </>
                  )}
                </div>
              </article>
            </Reveal>
          </div>

          <Reveal index={2}>
            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted">
              Das Abo verlängert sich automatisch um einen Monat und lässt sich
              jederzeit im Kundenbereich kündigen — der Zugang bleibt dann bis
              zum Ende der bezahlten Periode bestehen. Ihre Website läuft
              unabhängig davon weiter; ohne Abo können Sie die Inhalte nur nicht
              mehr selbst bearbeiten. Alle Preise in CHF, zzgl. MWST, sofern
              ausgewiesen. Zahlung über {site.name}s Zahlungsdienstleister
              Stripe.
            </p>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
