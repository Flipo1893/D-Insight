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

  const supabase = await createClient();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

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

  // Email confirmation is on by default in Supabase — no session yet means
  // the user still needs to click the link they were just sent.
  if (!data.session) {
    return {
      error: null,
      message:
        "Fast geschafft! Bitte bestätigen Sie Ihre E-Mail-Adresse über den Link, den wir Ihnen gerade geschickt haben.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
