export type AuthActionState = {
  error: string | null;
  message?: string | null;
};

export const initialAuthState: AuthActionState = { error: null, message: null };

export const notConfiguredState: AuthActionState = {
  error:
    "Supabase ist noch nicht konfiguriert. Bitte NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local setzen.",
};
