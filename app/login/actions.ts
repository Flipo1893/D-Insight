"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { safeNext } from "@/lib/auth-redirect";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { notConfiguredState, type AuthActionState } from "@/lib/supabase/types";

export async function login(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured) {
    return notConfiguredState;
  }

  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next") as string | null);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Deliberately generic: a distinct "unknown email" message would let
    // anyone probe which addresses have an account here.
    return { error: "E-Mail-Adresse oder Passwort stimmt nicht." };
  }

  revalidatePath("/", "layout");
  redirect(next);
}
