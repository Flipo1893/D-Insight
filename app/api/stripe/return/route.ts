import { NextResponse } from "next/server";
import { saveSubscription } from "@/lib/mongodb/sites";
import { getStripe } from "@/lib/stripe/client";
import { isStripeConfigured } from "@/lib/stripe/config";
import { toSiteSubscription } from "@/lib/stripe/subscription";
import { getCurrentUser } from "@/lib/supabase/auth";
import { siteUrl } from "@/lib/supabase/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Rückkehr aus dem Stripe-Checkout.
 *
 * Der Webhook allein würde reichen — aber er kommt asynchron, und in den
 * Sekunden davor stünde der Kunde nach erfolgreicher Zahlung wieder vor
 * der Bezahlschranke. Deshalb wird der Status hier einmal direkt geholt.
 * Der Webhook schreibt danach dasselbe noch einmal, was nichts schadet.
 */
export async function GET(request: Request) {
  const dashboard = new URL("/dashboard/abo", siteUrl);

  if (!isStripeConfigured) {
    return NextResponse.redirect(dashboard);
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.redirect(dashboard);
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", siteUrl));
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    // Die Session-ID steht in der Adresszeile und ist damit nichts, worauf
    // man sich verlassen kann. Erst der Abgleich mit dem angemeldeten
    // Konto macht daraus eine Freischaltung — sonst könnte jemand mit einer
    // fremden ID sein eigenes Konto freischalten.
    if (session.client_reference_id !== user.id) {
      return NextResponse.redirect(dashboard);
    }

    const subscription = session.subscription;
    if (subscription && typeof subscription !== "string") {
      await saveSubscription(user.id, toSiteSubscription(subscription));
    }
  } catch (error) {
    // Kein Drama: der Webhook holt das nach, die Abo-Seite erklärt die
    // kurze Wartezeit.
    console.error("[stripe] Rückkehr aus dem Checkout:", error);
  }

  dashboard.searchParams.set("status", "erfolg");
  return NextResponse.redirect(dashboard);
}
