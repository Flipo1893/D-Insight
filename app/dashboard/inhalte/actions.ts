"use server";

import { revalidatePath } from "next/cache";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { saveWebsiteContent } from "@/lib/mongodb/websites";
import { getCurrentUser } from "@/lib/supabase/auth";

export type ContentActionState = {
  error: string | null;
  success?: boolean;
};

export const notConfiguredState: ContentActionState = {
  error:
    "Die Datenbank ist noch nicht eingerichtet. MONGODB_URI fehlt in .env.local.",
};

const LIMITS = { heroTitle: 120, heroSubtitle: 300, aboutText: 1200 } as const;

export async function saveContent(
  _prevState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  if (!isMongoConfigured) {
    return notConfiguredState;
  }

  const user = await getCurrentUser();
  if (!user) {
    return {
      error: "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.",
    };
  }

  const heroTitle = String(formData.get("heroTitle") ?? "").trim();
  const heroSubtitle = String(formData.get("heroSubtitle") ?? "").trim();
  const aboutText = String(formData.get("aboutText") ?? "").trim();

  // The browser enforces required and maxLength, but a server action is a
  // public endpoint: anything posted straight to it would skip that.
  if (!heroTitle || !heroSubtitle || !aboutText) {
    return { error: "Bitte füllen Sie alle drei Felder aus." };
  }

  if (
    heroTitle.length > LIMITS.heroTitle ||
    heroSubtitle.length > LIMITS.heroSubtitle ||
    aboutText.length > LIMITS.aboutText
  ) {
    return { error: "Ein Feld ist zu lang. Bitte kürzen Sie den Text." };
  }

  await saveWebsiteContent(user.id, { heroTitle, heroSubtitle, aboutText });

  revalidatePath("/dashboard/inhalte");
  revalidatePath("/dashboard");
  return { error: null, success: true };
}

export { LIMITS };
