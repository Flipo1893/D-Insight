"use client";

import { useActionState } from "react";
import {
  saveContent,
  type ContentActionState,
} from "@/app/dashboard/inhalte/actions";
import type { WebsiteContentFields } from "@/lib/mongodb/websites";

const initialState: ContentActionState = { error: null };

const fieldClass =
  "w-full rounded-brand border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted hover:border-border-strong focus:border-accent";

export default function ContentForm({
  content,
  disabled = false,
}: {
  content: WebsiteContentFields;
  disabled?: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    saveContent,
    initialState,
  );
  const busy = pending || disabled;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="heroTitle" className="text-sm text-muted-strong">
          Hero-Überschrift
        </label>
        <input
          id="heroTitle"
          name="heroTitle"
          type="text"
          required
          maxLength={120}
          disabled={busy}
          defaultValue={content.heroTitle}
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="heroSubtitle" className="text-sm text-muted-strong">
          Hero-Text
        </label>
        <textarea
          id="heroSubtitle"
          name="heroSubtitle"
          rows={3}
          required
          maxLength={300}
          disabled={busy}
          defaultValue={content.heroSubtitle}
          className={`${fieldClass} resize-y`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="aboutText" className="text-sm text-muted-strong">
          Über-uns-Text
        </label>
        <textarea
          id="aboutText"
          name="aboutText"
          rows={5}
          required
          maxLength={1200}
          disabled={busy}
          defaultValue={content.aboutText}
          className={`${fieldClass} resize-y`}
        />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-brand bg-accent-strong px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-hover active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
      >
        {pending ? "Wird gespeichert" : "Speichern"}
      </button>

      {/* Success and error are visually distinct: a red "Gespeichert" reads
          as a failure at a glance. */}
      <p aria-live="polite" className="min-h-5 text-sm">
        {state.error ? (
          <span className="text-accent-text">{state.error}</span>
        ) : state.success ? (
          <span className="text-foreground">
            Gespeichert. Die Änderungen sind übernommen.
          </span>
        ) : null}
      </p>
    </form>
  );
}
