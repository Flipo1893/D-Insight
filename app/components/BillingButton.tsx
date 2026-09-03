"use client";

import { useActionState } from "react";
import type { BillingActionState } from "@/app/dashboard/abo/actions";

const initialState: BillingActionState = { error: null };

type BillingButtonProps = {
  action: () => Promise<BillingActionState>;
  label: string;
  pendingLabel: string;
  variant?: "primary" | "secondary";
};

/**
 * Ein Knopf, der zu Stripe weiterleitet.
 *
 * Die Weiterleitung passiert in der Server Action, nicht hier — die
 * Checkout-URL entsteht mit dem geheimen Schlüssel, der den Browser nie
 * erreichen darf.
 */
export default function BillingButton({
  action,
  label,
  pendingLabel,
  variant = "primary",
}: BillingButtonProps) {
  // Der Wrapper schluckt die Argumente von useActionState: die Aktionen
  // brauchen weder den vorherigen Zustand noch Formulardaten.
  const [state, formAction, pending] = useActionState(
    () => action(),
    initialState,
  );

  const styles =
    variant === "primary"
      ? "bg-accent text-white hover:bg-accent-hover"
      : "border border-border text-foreground hover:bg-surface";

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <button
        type="submit"
        disabled={pending}
        className={`w-full rounded-brand px-6 py-3 text-sm font-semibold transition-colors disabled:opacity-60 sm:w-fit ${styles}`}
      >
        {pending ? pendingLabel : label}
      </button>

      {state.error && (
        <p role="alert" className="text-sm text-accent">
          {state.error}
        </p>
      )}
    </form>
  );
}
