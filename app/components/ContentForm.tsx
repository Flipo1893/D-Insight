"use client";

import { useActionState } from "react";
import {
  saveContent,
  type ContentActionState,
} from "@/app/dashboard/inhalte/actions";
import type { SiteField } from "@/lib/mongodb/sites";

const initialState: ContentActionState = { error: null };

const inputClasses =
  "w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent";

type ContentFormProps = {
  fields: SiteField[];
  content: Record<string, string>;
};

/**
 * What the customer reads after pressing Speichern.
 *
 * Written for someone who does not know there is a repository, a build or a
 * database. They want to know one thing: is it on my website, and if not,
 * when.
 */
function statusMessage(
  state: ContentActionState,
): { text: string; tone: "ok" | "problem" } | null {
  if (state.error) return { text: state.error, tone: "problem" };
  if (!state.success) return null;

  switch (state.publish) {
    case "live":
      return {
        text: "Gespeichert. Ihre Website wird aktualisiert und ist in etwa einer Minute auf dem neuen Stand.",
        tone: "ok",
      };
    case "unveraendert":
      return {
        text: "Gespeichert. Auf Ihrer Website war bereits alles aktuell.",
        tone: "ok",
      };
    case "ausstehend":
      return {
        text: "Ihre Texte sind gespeichert, aber Ihre Website konnte gerade nicht aktualisiert werden. Bitte versuchen Sie es in ein paar Minuten erneut oder melden Sie sich bei uns.",
        tone: "problem",
      };
    default:
      return { text: "Gespeichert.", tone: "ok" };
  }
}

export default function ContentForm({ fields, content }: ContentFormProps) {
  const [state, formAction, pending] = useActionState(saveContent, initialState);
  const message = statusMessage(state);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {fields.map((field) => (
        <div key={field.key}>
          <label htmlFor={field.key} className="mb-1 block text-sm text-muted">
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.key}
              name={field.key}
              rows={3}
              maxLength={2000}
              defaultValue={content[field.key] ?? ""}
              className={`${inputClasses} resize-y`}
            />
          ) : (
            <input
              id={field.key}
              name={field.key}
              type="text"
              maxLength={2000}
              defaultValue={content[field.key] ?? ""}
              className={inputClasses}
            />
          )}
        </div>
      ))}

      {/* Success and failure must not look alike. This used to render
          "Gespeichert." in the accent red, which reads as an error. */}
      <p aria-live="polite" className="min-h-5 text-sm leading-relaxed">
        {message && (
          <span
            className={
              message.tone === "problem" ? "text-accent-text" : "text-foreground"
            }
          >
            {message.text}
          </span>
        )}
      </p>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60 sm:w-fit"
      >
        {pending ? "Speichern…" : "Speichern"}
      </button>
    </form>
  );
}
