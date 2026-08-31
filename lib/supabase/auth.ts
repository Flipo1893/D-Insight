import { cache } from "react";
import { isSupabaseConfigured } from "./config";
import { createClient } from "./server";

// Wrapped in React's cache() so the layout and every dashboard subpage that
// call this during the same request share one Supabase round-trip instead
// of re-verifying the session per component.
export const getCurrentUser = cache(async () => {
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});
