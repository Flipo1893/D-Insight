"use client";

import { useActionState } from "react";
import {
  saveContent,
  type ContentActionState,
} from "@/app/dashboard/inhalte/actions";
import type { WebsiteContentFields } from "@/lib/mongodb/websites";

const initialState: ContentActionState = { error: null };

type ContentFormProps = {
  content: WebsiteContentFields;
};

export default function ContentForm({ content }: ContentFormProps) {
  const [state, formAction, pending] = useActionState(saveContent, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <label htmlFor="heroTitle" className="mb-1 block text-sm text-muted">
          Hero-Überschrift
        </label>
        <input
          id="heroTitle"
          name="heroTitle"
          type="text"
          required
          defaultValue={content.heroTitle}
          className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="heroSubtitle" className="mb-1 block text-sm text-muted">
          Hero-Text
        </label>
        <textarea
          id="heroSubtitle"
          name="heroSubtitle"
          rows={3}
          required
          defaultValue={content.heroSubtitle}
          className="w-full resize-none rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="aboutText" className="mb-1 block text-sm text-muted">
          Über-uns-Text
        </label>
        <textarea
          id="aboutText"
          name="aboutText"
          rows={4}
          required
          defaultValue={content.aboutText}
          className="w-full resize-none rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent"
        />
      </div>

      {state.error && <p className="text-sm text-accent">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-accent">Gespeichert.</p>
      )}

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
