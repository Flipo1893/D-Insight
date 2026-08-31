"use client";

import { useState, type FormEvent } from "react";

type AuthFormProps = {
  mode: "login" | "signup";
};

// No backend yet — user accounts land in Supabase later. For now this just
// confirms the submission and explains that the customer area is coming.
export default function AuthForm({ mode }: AuthFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-md border border-border bg-surface p-6 text-center">
        <p className="font-medium">Danke!</p>
        <p className="mt-2 text-sm text-muted">
          Der Kundenbereich ist noch im Aufbau. Sobald er startet, melden wir
          uns bei Ihnen — inklusive der Möglichkeit, Ihre Website-Inhalte
          selbst zu bearbeiten und Traffic-Zahlen einzusehen.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

      <button
        type="submit"
        className="mt-2 w-full rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        {mode === "login" ? "Anmelden" : "Konto erstellen"}
      </button>
    </form>
  );
}
