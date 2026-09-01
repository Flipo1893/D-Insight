"use client";

import { useActionState, useState } from "react";
import { initialAuthState, type AuthActionState } from "@/lib/supabase/types";

type AuthFormProps = {
  mode: "login" | "signup";
  action: (
    state: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
  /** Same-site path to return to after a successful login. */
  next?: string;
};

const fieldClass =
  "w-full rounded-brand border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted hover:border-border-strong focus:border-accent";

export default function AuthForm({ mode, action, next }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialAuthState);
  const [showPassword, setShowPassword] = useState(false);

  if (state.message) {
    return (
      <div
        role="status"
        className="rounded-brand border border-accent bg-[var(--accent-soft)] p-6"
      >
        <p className="font-semibold">Fast geschafft</p>
        <p className="mt-2 text-sm text-muted-strong">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {mode === "signup" && (
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm text-muted-strong">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            disabled={pending}
            placeholder="Ihr Name"
            className={fieldClass}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm text-muted-strong">
          E-Mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={pending}
          placeholder="name@firma.ch"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm text-muted-strong">
          Passwort
          {mode === "signup" ? (
            <span className="ml-2 text-muted">mindestens 8 Zeichen</span>
          ) : null}
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={mode === "signup" ? 8 : undefined}
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            disabled={pending}
            placeholder="Ihr Passwort"
            className={`${fieldClass} pr-20`}
          />
          {/* Typing a password blind is the single biggest cause of failed
              logins on phones, so offer to reveal it. */}
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-brand px-2 py-1 text-xs font-medium text-muted transition-colors hover:text-foreground"
          >
            {showPassword ? "verbergen" : "zeigen"}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 w-full rounded-brand bg-accent-strong px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-hover active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending
          ? "Einen Moment"
          : mode === "login"
            ? "Anmelden"
            : "Konto erstellen"}
      </button>

      {/* Announced to screen readers the moment the action comes back. */}
      <p aria-live="polite" className="min-h-5 text-sm">
        {state.error ? (
          <span className="text-accent-text">{state.error}</span>
        ) : null}
      </p>
    </form>
  );
}
