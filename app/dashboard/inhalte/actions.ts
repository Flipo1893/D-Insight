"use server";

import { revalidatePath } from "next/cache";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { getSite, saveSiteContent } from "@/lib/mongodb/sites";
import { getCurrentUser } from "@/lib/supabase/auth";

export type ContentActionState = {
  error: string | null;
  success?: boolean;
};

export const notConfiguredState: ContentActionState = {
  error: "MongoDB ist noch nicht konfiguriert. Bitte MONGODB_URI in .env.local setzen.",
};

export async function saveContent(
  _prevState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  if (!isMongoConfigured) {
    return notConfiguredState;
  }

  const user = await getCurrentUser();
  if (!user) {
    return { error: "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an." };
  }

  try {
    // Only the fields an admin configured for this site get saved — the
    // form is rendered from the same list, so anything else in the payload
    // is ignored rather than trusted.
    const site = await getSite(user.id);
    const content: Record<string, string> = {};
    for (const field of site.fields) {
      content[field.key] = (formData.get(field.key) as string | null) ?? "";
    }

    await saveSiteContent(user.id, content);
  } catch {
    return {
      error:
        "Die Datenbank ist gerade nicht erreichbar — Ihre Änderungen wurden nicht gespeichert. Bitte versuchen Sie es erneut.",
    };
  }

  revalidatePath("/dashboard/inhalte");
  return { error: null, success: true };
}
