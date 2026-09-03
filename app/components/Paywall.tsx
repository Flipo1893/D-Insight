import Link from "next/link";
import BillingButton from "./BillingButton";
import { startCheckout } from "@/app/dashboard/abo/actions";
import type { Access } from "@/lib/billing";

/**
 * Was ein Konto ohne aktives Abo im Kundenbereich sieht.
 *
 * Steht bewusst im Layout an der Stelle der Unterseiten, statt jede Seite
 * einzeln zu schützen: eine Seite, die man beim Nachrüsten vergisst, ist
 * ein offenes Tor — und beim Vergessen merkt es niemand, weil die Seite ja
 * funktioniert.
 */
export default function Paywall({ access }: { access: Access }) {
  const wasCustomer = Boolean(access.subscription.customerId);

  return (
    <div className="mx-auto max-w-xl rounded-brand border border-border bg-surface p-8 text-center">
      <h2 className="text-2xl font-semibold tracking-tight">
        {wasCustomer ? "Ihr Abo ist beendet" : "Kundenbereich freischalten"}
      </h2>
      <p className="mt-4 text-muted">
        {wasCustomer
          ? "Der Zugang zu Inhalten, Projektstatus und Auswertungen ist abgelaufen. Mit einem neuen Abo sind Ihre Daten sofort wieder da — gelöscht wurde nichts."
          : "Im Abo enthalten: Texte Ihrer Website selbst bearbeiten, Projektstatus verfolgen, Besucherzahlen und die technische Überwachung Ihrer Seite."}
      </p>

      <div className="mt-8 flex justify-center">
        <BillingButton
          action={startCheckout}
          label={wasCustomer ? "Abo erneuern" : "Abo starten"}
          pendingLabel="Weiterleitung…"
        />
      </div>

      <p className="mt-6 text-sm text-muted">
        Monatlich kündbar. Fragen dazu?{" "}
        <Link href="/#kontakt" className="text-accent-text hover:underline">
          Schreiben Sie uns
        </Link>
        .
      </p>
    </div>
  );
}
