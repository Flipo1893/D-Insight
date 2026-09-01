"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
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

const STEPS = ["Ihre Website", "Rahmen", "Kontakt"] as const;

/**
 * Enquiry as three short steps rather than one block of eight fields.
 *
 * A long form asks someone to commit before they know what they are getting
 * into, and every field in view is another reason to give up. Split into
 * three, each step looks trivial, and someone who answered the first
 * question is far likelier to finish. Same fields and same payload; only
 * the order they are asked for changed.
 *
 * Fields stay mounted and are hidden visually rather than unmounted, so a
 * half-filled form survives stepping back and forth and the browser can
 * still autofill across steps.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [problem, setProblem] = useState("");

  // The address from the quick check lives outside React, so it is read as
  // an external store rather than copied into state from an effect.
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
        setProblem("");
        setStep(0);
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
  const isLast = step === STEPS.length - 1;
  const canAdvance = step > 0 || problem.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {/* Named steps rather than "2 von 3", so the visitor sees how little is
          left instead of only how far they have come. */}
      <ol className="flex gap-2" aria-label="Fortschritt">
        {STEPS.map((label, index) => (
          <li key={label} className="flex flex-1 flex-col gap-2">
            <span
              aria-hidden
              className={`h-0.5 rounded-full transition-colors duration-300 ${
                index <= step ? "bg-accent" : "bg-border"
              }`}
            />
            <span
              className={`text-xs transition-colors ${
                index === step ? "text-foreground" : "text-muted"
              }`}
            >
              {label}
              {index === step ? (
                <span className="sr-only"> (aktueller Schritt)</span>
              ) : null}
            </span>
          </li>
        ))}
      </ol>

      <div className={step === 0 ? "flex flex-col gap-5" : "hidden"}>
        <div className="flex flex-col gap-2">
          <label htmlFor="problem" className="text-sm text-muted-strong">
            Was stört Sie an Ihrer Website?
          </label>
          <textarea
            id="problem"
            name="problem"
            rows={4}
            value={problem}
            onChange={(event) => setProblem(event.target.value)}
            disabled={busy}
            placeholder="Zum Beispiel: sieht veraltet aus, bricht auf dem Handy, kommt bei Google nicht vor."
            className={`${fieldClass} resize-y`}
          />
          <p className="text-xs text-muted">
            Ein, zwei Sätze genügen. Den Rest klären wir im Gespräch.
          </p>
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
      </div>

      <div className={step === 1 ? "grid gap-5 sm:grid-cols-2" : "hidden"}>
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

        <p className="text-xs leading-relaxed text-muted sm:col-span-2">
          Beides darf offen bleiben. Es hilft uns nur, die erste Antwort
          konkreter zu machen.
        </p>
      </div>

      <div className={isLast ? "flex flex-col gap-5" : "hidden"}>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm text-muted-strong">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required={isLast}
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
            required={isLast}
            autoComplete="email"
            disabled={busy}
            placeholder="name@firma.ch"
            className={fieldClass}
          />
        </div>

        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required={isLast}
            disabled={busy}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
          />
          <label
            htmlFor="consent"
            className="text-sm leading-relaxed text-muted"
          >
            Ich bin einverstanden, dass meine Angaben zur Bearbeitung der
            Anfrage gespeichert werden.{" "}
            <Link
              href="/datenschutz"
              className="text-muted-strong underline transition-colors hover:text-accent-text"
            >
              Datenschutz
            </Link>
          </label>
        </div>
      </div>

      {/* Honeypot. Hidden from people, tempting for bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Firma nicht ausfüllen</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((current) => current - 1)}
            disabled={busy}
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Zurück
          </button>
        )}

        {isLast ? (
          <button
            type="submit"
            disabled={busy}
            className="rounded-brand bg-accent-strong px-6 py-3 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-accent-hover active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Wird gesendet" : primaryCta}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep((current) => current + 1)}
            disabled={busy || !canAdvance}
            className="rounded-brand bg-accent-strong px-6 py-3 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-accent-hover active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
          >
            Weiter
          </button>
        )}
      </div>

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
