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

export default function ContentForm({ fields, content }: ContentFormProps) {
  const [state, formAction, pending] = useActionState(saveContent, initialState);

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
              defaultValue={content[field.key] ?? ""}
              className={`${inputClasses} resize-none`}
            />
          ) : (
            <input
              id={field.key}
              name={field.key}
              type="text"
              defaultValue={content[field.key] ?? ""}
              className={inputClasses}
            />
          )}
        </div>
      ))}

      {state.error && <p className="text-sm text-accent">{state.error}</p>}
      {state.success && <p className="text-sm text-accent">Gespeichert.</p>}

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
