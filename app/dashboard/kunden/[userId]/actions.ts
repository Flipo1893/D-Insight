"use server";

import { revalidatePath } from "next/cache";
import { isAdminEmail } from "@/lib/admin";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { saveSiteSettings, type SiteField } from "@/lib/mongodb/sites";
import { getCurrentUser } from "@/lib/supabase/auth";
import { steps } from "@/app/lib/content";

export type SettingsActionState = {
  error: string | null;
  success?: boolean;
};

function parseFields(raw: string): SiteField[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  const seen = new Set<string>();
  const fields: SiteField[] = [];

  for (const entry of parsed) {
    if (typeof entry !== "object" || entry === null) continue;
    const { key, label, type } = entry as Record<string, unknown>;

    // A field is only usable if its key is a valid, unique identifier — it
    // becomes a JSON key in the public content API.
    if (typeof key !== "string" || !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(key)) continue;
    if (seen.has(key)) continue;
    seen.add(key);

    fields.push({
      key,
      label: typeof label === "string" && label.trim() ? label.trim() : key,
      type: type === "textarea" ? "textarea" : "text",
    });
  }

  return fields;
}

export async function saveSettings(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  if (!isMongoConfigured) {
    return {
      error: "MongoDB ist noch nicht konfiguriert. Bitte MONGODB_URI in .env.local setzen.",
    };
  }

  // Re-checked here, not just hidden in the UI — this action is reachable
  // by anyone who is logged in.
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) {
    return { error: "Keine Berechtigung." };
  }

  const targetUserId = formData.get("userId") as string | null;
  if (!targetUserId) {
    return { error: "Kunde nicht gefunden." };
  }

  const fields = parseFields((formData.get("fields") as string | null) ?? "[]");
  if (fields.length === 0) {
    return { error: "Mindestens ein gültiges Feld angeben (Schlüssel z. B. heroTitle)." };
  }

  try {
    // Phase is a select, but a server action is a public endpoint, so the
    // value is clamped rather than trusted.
    const rawPhase = Number(formData.get("phase"));
    const phase = Number.isInteger(rawPhase)
      ? Math.min(Math.max(rawPhase, -1), steps.length)
      : -1;

    // One item per line, which is how someone actually types a list.
    const pending = ((formData.get("pending") as string | null) ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 20);

    await saveSiteSettings(targetUserId, {
      siteName: ((formData.get("siteName") as string | null) ?? "").trim(),
      siteUrl: ((formData.get("siteUrl") as string | null) ?? "").trim(),
      fields,
      phase,
      pending,
      phaseNote: ((formData.get("phaseNote") as string | null) ?? "")
        .trim()
        .slice(0, 500),
    });
  } catch {
    return {
      error:
        "Die Datenbank ist gerade nicht erreichbar — die Einstellungen wurden nicht gespeichert.",
    };
  }

  revalidatePath("/dashboard/kunden");
  revalidatePath(`/dashboard/kunden/${targetUserId}`);
  return { error: null, success: true };
}
