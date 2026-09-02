"use client";

import { useActionState, useState } from "react";
import {
  saveSettings,
  type SettingsActionState,
} from "@/app/dashboard/kunden/[userId]/actions";
import type { Site, SiteField, SiteFieldType } from "@/lib/mongodb/sites";
import { steps } from "../lib/content";

const initialState: SettingsActionState = { error: null };

const inputClasses =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent";

export default function SiteSettingsForm({ site }: { site: Site }) {
  const [state, formAction, pending] = useActionState(saveSettings, initialState);
  const [fields, setFields] = useState<SiteField[]>(site.fields);

  function updateField(index: number, patch: Partial<SiteField>) {
    setFields((current) =>
      current.map((field, i) => (i === index ? { ...field, ...patch } : field)),
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="userId" value={site.userId} />
      {/* The field list is dynamic, so it travels as JSON rather than as
          individually named inputs. */}
      <input type="hidden" name="fields" value={JSON.stringify(fields)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="siteName" className="mb-1 block text-sm text-muted">
            Kunde / Projektname
          </label>
          <input
            id="siteName"
            name="siteName"
            type="text"
            defaultValue={site.siteName}
            placeholder="Bäckerei Müller"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="siteUrl" className="mb-1 block text-sm text-muted">
            Website-URL
          </label>
          <input
            id="siteUrl"
            name="siteUrl"
            type="text"
            defaultValue={site.siteUrl}
            placeholder="https://baeckerei-mueller.de"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Project status. The customer sees this on their own overview, which
          saves the recurring "wie weit seid ihr" email in both directions. */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phase" className="mb-1 block text-sm text-muted">
            Projektstand
          </label>
          <select
            id="phase"
            name="phase"
            defaultValue={String(site.phase)}
            className={inputClasses}
          >
            <option value="-1">Noch nicht gestartet</option>
            {steps.map((step, index) => (
              <option key={step.title} value={String(index)}>
                {index + 1}. {step.title}
              </option>
            ))}
            <option value={String(steps.length)}>Abgeschlossen</option>
          </select>
        </div>
        <div>
          <label htmlFor="phaseNote" className="mb-1 block text-sm text-muted">
            Notiz an den Kunden
            <span className="ml-2 text-muted">optional</span>
          </label>
          <input
            id="phaseNote"
            name="phaseNote"
            type="text"
            maxLength={500}
            defaultValue={site.phaseNote}
            placeholder="Konzept ist raus, wir warten auf Rückmeldung."
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="pending" className="mb-1 block text-sm text-muted">
          Offen vom Kunden
          <span className="ml-2 text-muted">eine Sache pro Zeile</span>
        </label>
        <textarea
          id="pending"
          name="pending"
          rows={4}
          defaultValue={site.pending.join("\n")}
          placeholder={"Logo in hoher Auflösung\nTexte für die Über-uns-Seite\nZugang zur Domain"}
          className={`${inputClasses} resize-y`}
        />
      </div>

      <div>
        <p className="text-sm font-medium">Editierbare Felder</p>
        <p className="mt-1 text-sm text-muted">
          Der Schlüssel ist der Name, unter dem die Kundenwebsite den Wert aus
          der Content-API liest. Die Bezeichnung sieht der Kunde im Dashboard.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {fields.map((field, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end"
            >
              <div>
                <label className="mb-1 block text-xs text-muted">
                  Schlüssel
                </label>
                <input
                  type="text"
                  value={field.key}
                  onChange={(e) => updateField(index, { key: e.target.value })}
                  placeholder="heroTitle"
                  className={`${inputClasses} font-mono`}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted">
                  Bezeichnung
                </label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(index, { label: e.target.value })}
                  placeholder="Hero-Überschrift"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted">Typ</label>
                <select
                  value={field.type}
                  onChange={(e) =>
                    updateField(index, { type: e.target.value as SiteFieldType })
                  }
                  className={inputClasses}
                >
                  <option value="text">Einzeilig</option>
                  <option value="textarea">Mehrzeilig</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFields((current) => current.filter((_, i) => i !== index))
                }
                className="rounded-md border border-border px-3 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Entfernen
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setFields((current) => [
              ...current,
              { key: "", label: "", type: "text" },
            ])
          }
          className="mt-3 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
        >
          Feld hinzufügen
        </button>
      </div>

      {/* Success and failure must not look identical. A red "Gespeichert."
          reads as an error at a glance. */}
      <p aria-live="polite" className="min-h-5 text-sm">
        {state.error ? (
          <span className="text-accent-text">{state.error}</span>
        ) : state.success ? (
          <span className="text-foreground">Gespeichert.</span>
        ) : null}
      </p>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60 sm:w-fit"
      >
        {pending ? "Speichern…" : "Einstellungen speichern"}
      </button>
    </form>
  );
}
