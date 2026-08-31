import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAnonKey, supabaseUrl } from "./config";

// For use inside Server Components, Server Actions and Route Handlers. Only
// call this after checking isSupabaseConfigured — it throws if the env vars
// are missing.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component render — middleware.ts already
          // refreshes the session cookie on the request/response, so this
          // particular write can be safely ignored.
        }
      },
    },
  });
}
