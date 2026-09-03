import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // api/stripe/webhook ist bewusst ausgenommen: dort ist niemand
    // angemeldet, die Stripe-Signatur ist die Authentifizierung. Ein
    // Session-Refresh waere dort nur eine Supabase-Anfrage ohne Zweck.
    "/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
