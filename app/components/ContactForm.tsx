"use client";

import { useSyncExternalStore, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  budgetOptions,
  primaryCta,
  site,
  timelineOptions,
} from "../lib/content";
import { readCheckedUrl, subscribeToCheckedUrl } from "@/lib/checked-url";

// Formspree endpoint. Create a form at formspree.io and put the ID into
// .env.local as NEXT_PUBLIC_FORMSPREE_ID (see .env.local.example).
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "w-full rounded-brand border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted hover:border-border-strong focus:border-accent";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  // The address from the quick check lives outside React, so it is read as
  // an external store rather than copied into state from an effect. Feeding
  // it through the key makes the field remount with the new value while
  // staying uncontrolled, so typing in it still works normally.
  const checkedUrl = useSyncExternalStore(
    subscribeToCheckedUrl,
    readCheckedUrl,
    () => "",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real people leave this hidden field empty.
    if (data.get("company")) {
      setStatus("success");
      form.reset();
      return;
    }
    data.delete("company");

    setStatus("submitting");

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
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

  // Without a configured endpoint the form would post to a dead URL and always
  // fail, so fall back to a mail link that actually reaches us.
  if (!FORMSPREE_ID) {
    return (
      <div className="rounded-brand border border-dashed border-border bg-surface p-6">
        <p className="text-sm text-muted-strong">
          Das Formular ist noch nicht verbunden. Schreiben Sie uns solange
          direkt:
        </p>
        <a
          href={`mailto:${site.email}?subject=${encodeURIComponent(primaryCta)}`}
          className="mt-4 inline-block rounded-brand bg-accent-strong px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          {site.email}
        </a>
        <p className="mt-4 font-mono text-xs text-muted">
          Setup: NEXT_PUBLIC_FORMSPREE_ID in .env.local eintragen.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-brand border border-accent bg-[var(--accent-soft)] p-8"
      >
        <p className="text-lg font-semibold">Nachricht ist angekommen.</p>
        <p className="mt-2 text-muted-strong">
          Wir melden uns innerhalb von {site.replyWindow} mit einer ersten
          Einschätzung.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-accent-text transition-colors hover:text-foreground"
        >
          Weitere Nachricht senden
        </button>
      </div>
    );
  }

  const busy = status === "submitting";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
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
          disabled={busy}
          placeholder="Ihr Name"
          className={fieldClass}
        />
      </div>

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
          disabled={busy}
          placeholder="name@firma.ch"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="website" className="text-sm text-muted-strong">
          Website-URL
          <span className="ml-2 text-muted">optional</span>
        </label>
        <input
          id="website"
          name="website"
          type="url"
          inputMode="url"
          autoComplete="url"
          disabled={busy}
          key={checkedUrl}
          defaultValue={checkedUrl}
          placeholder="https://ihre-website.ch"
          className={fieldClass}
        />
      </div>

      {/* Budget and timeline qualify the lead up front. Without them the
          first reply is always the same two questions, which costs a round. */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="budget" className="text-sm text-muted-strong">
            Budgetrahmen
          </label>
          <select
            id="budget"
            name="budget"
            defaultValue=""
            disabled={busy}
            className={fieldClass}
          >
            <option value="">Noch offen</option>
            {budgetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="timeline" className="text-sm text-muted-strong">
            Zeitrahmen
          </label>
          <select
            id="timeline"
            name="timeline"
            defaultValue=""
            disabled={busy}
            className={fieldClass}
          >
            <option value="">Noch offen</option>
            {timelineOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm text-muted-strong">
          Nachricht
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          disabled={busy}
          placeholder="Was soll sich an Ihrer Website verändern?"
          className={`${fieldClass} resize-y`}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          disabled={busy}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
        />
        <label htmlFor="consent" className="text-sm leading-relaxed text-muted">
          Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage
          gespeichert werden.{" "}
          <Link
            href="/datenschutz"
            className="text-muted-strong underline transition-colors hover:text-accent-text"
          >
            Datenschutz
          </Link>
        </label>
      </div>

      {/* Honeypot. Hidden from people, tempting for bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Firma nicht ausfüllen</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-1 w-full rounded-brand bg-accent-strong px-6 py-3 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-accent-hover active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
      >
        {busy ? "Wird gesendet" : primaryCta}
      </button>

      <p aria-live="polite" className="min-h-5 text-sm">
        {status === "error" ? (
          <span className="text-accent-text">
            Das Senden hat nicht geklappt. Schreiben Sie uns gerne direkt an{" "}
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>
            .
          </span>
        ) : null}
      </p>
    </form>
  );
}
