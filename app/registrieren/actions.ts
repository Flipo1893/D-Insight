"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured, siteUrl } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { notConfiguredState, type AuthActionState } from "@/lib/supabase/types";

export async function signup(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured) {
    return notConfiguredState;
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) {
    return { error: "Das Passwort muss mindestens 8 Zeichen lang sein." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Email confirmation is on by default in Supabase. No session means the
  // account exists but the link in the inbox has not been clicked yet.
  if (!data.session) {
    return {
      error: null,
      message:
        "Wir haben Ihnen eine E-Mail geschickt. Bitte bestätigen Sie darin Ihre Adresse, dann können Sie sich anmelden.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
