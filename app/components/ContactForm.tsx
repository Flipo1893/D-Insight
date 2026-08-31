"use client";

import { useState, type FormEvent } from "react";

// Replace with your own Formspree endpoint: https://formspree.io/f/<your-form-id>
// Sign up at formspree.io, create a form, and drop the ID into .env.local as
// NEXT_PUBLIC_FORMSPREE_ID (see .env.local.example).
const FORMSPREE_ID =
  process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "YOUR_FORMSPREE_ID";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch(
        `https://formspree.io/f/${FORMSPREE_ID}`,
        {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        },
      );

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <label htmlFor="website" className="mb-1 block text-sm text-muted">
          Website-URL
        </label>
        <input
          id="website"
          name="website"
          type="text"
          placeholder="https://ihre-website.de"
          className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm text-muted">
          Nachricht
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Was soll sich an Ihrer Website verändern?"
          className="w-full resize-none rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 w-full rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60 sm:w-fit"
      >
        {status === "submitting" ? "Wird gesendet…" : "Angebot anfordern"}
      </button>

      {status === "success" && (
        <p className="text-sm text-accent">
          Danke! Wir melden uns innerhalb von zwei Werktagen.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-accent">
          Da ist etwas schiefgelaufen. Schreiben Sie uns gerne direkt eine
          E-Mail.
        </p>
      )}
    </form>
  );
}
