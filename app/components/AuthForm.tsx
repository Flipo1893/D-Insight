"use client";

import { useActionState } from "react";
import { initialAuthState, type AuthActionState } from "@/lib/supabase/types";

type AuthFormProps = {
  mode: "login" | "signup";
  action: (state: AuthActionState, formData: FormData) => Promise<AuthActionState>;
};

export default function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialAuthState);

  if (state.message) {
    return (
      <div className="rounded-md border border-border bg-surface p-6 text-center">
        <p className="font-medium">Fast geschafft!</p>
        <p className="mt-2 text-sm text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {mode === "signup" && (
        <div>
          <label htmlFor="name" className="mb-1 block text-sm text-muted">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Ihr Name"
            className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
        </div>
      )}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-muted">
          E-Mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="name@firma.de"
          className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm text-muted">
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="••••••••"
          className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent"
        />
      </div>

      {state.error && <p className="text-sm text-accent">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-full rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending
          ? "Einen Moment…"
          : mode === "login"
            ? "Anmelden"
            : "Konto erstellen"}
      </button>
    </form>
  );
}
