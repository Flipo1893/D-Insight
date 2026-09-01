import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./config";
import { createClient } from "./server";

/**
 * Wrapped in React's cache() so the dashboard layout and every subpage that
 * asks for the user during one request share a single Supabase round-trip
 * instead of re-verifying the session per component.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

/** Falls back to the email when the account has no name on it. */
export function displayName(user: User): string {
  const name = user.user_metadata?.full_name;
  return typeof name === "string" && name.trim() !== ""
    ? name.trim()
    : (user.email ?? "Kundenbereich");
}
