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

  const heroTitle = formData.get("heroTitle") as string;
  const heroSubtitle = formData.get("heroSubtitle") as string;
  const aboutText = formData.get("aboutText") as string;

  await saveWebsiteContent(user.id, { heroTitle, heroSubtitle, aboutText });

  revalidatePath("/dashboard/inhalte");
  return { error: null, success: true };
}
