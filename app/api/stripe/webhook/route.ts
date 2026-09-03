import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { findSiteByStripeCustomer, saveSubscription } from "@/lib/mongodb/sites";
import { getStripe } from "@/lib/stripe/client";
import { toSiteSubscription } from "@/lib/stripe/subscription";
import { isStripeConfigured, stripeWebhookSecret } from "@/lib/stripe/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Vom Abo zurück zum Konto.
 *
 * Die userId steht in den Metadaten, weil wir sie beim Checkout dort
 * hinterlegen. Für Abos, die jemand von Hand im Stripe-Dashboard angelegt
 * hat, bleibt die Kundennummer als zweiter Weg.
 */
async function resolveUserId(
  subscription: Stripe.Subscription,
): Promise<string | null> {
  const fromMetadata = subscription.metadata?.userId;
  if (fromMetadata) {
    return fromMetadata;
  }

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const site = await findSiteByStripeCustomer(customerId);
  return site?.userId ?? null;
}

/**
 * Stripe meldet hier jede Änderung am Abo.
 *
 * Das ist der einzige Weg, von einer Kündigung oder einer geplatzten
 * Zahlung zu erfahren — der Kunde kommt danach ja nicht extra vorbei, um
 * es uns zu sagen. Angemeldet ist hier niemand: die Signatur im Header
 * *ist* die Authentifizierung. Deshalb ist diese Route auch aus dem
 * Session-Refresh in proxy.ts ausgenommen.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured || !stripeWebhookSecret) {
    // 404 statt 503: ohne Konfiguration gibt es diesen Endpunkt für die
    // Aussenwelt schlicht nicht.
    return new NextResponse(null, { status: 404 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new NextResponse(null, { status: 400 });
  }

  // Der Rohtext, nicht request.json(): die Signatur wird über die exakten
  // Bytes gebildet, und ein einmal geparstes und neu serialisiertes JSON
  // ist nicht mehr Byte für Byte dasselbe.
  const body = await request.text();

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      stripeWebhookSecret,
    );
  } catch {
    return NextResponse.json({ error: "Ungültige Signatur." }, { status: 400 });
  }

  try {
    let subscriptionId: string | null = null;

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : (session.subscription?.id ?? null);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed":
        subscriptionId = event.data.object.id;
        break;

      default:
        // Alles andere quittieren wir, ohne etwas zu tun. Stripe schickt
        // deutlich mehr Ereignisse, als hier gebraucht werden.
        return NextResponse.json({ received: true });
    }

    if (!subscriptionId) {
      return NextResponse.json({ received: true });
    }

    // Bewusst der frische Stand statt der Daten aus dem Ereignis:
    // Webhooks kommen nicht garantiert in der Reihenfolge an, in der sie
    // entstanden sind. Ein verspätetes "created" nach einem "deleted"
    // würde ein gekündigtes Abo sonst wieder freischalten.
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const userId = await resolveUserId(subscription);
    if (!userId) {
      // Kein Konto dazu — etwa ein Testabo, das direkt in Stripe entstand.
      // Kein Fehler, sonst versucht Stripe es tagelang erneut.
      return NextResponse.json({ received: true, matched: false });
    }

    await saveSubscription(userId, toSiteSubscription(subscription));

    return NextResponse.json({ received: true, matched: true });
  } catch (error) {
    // 500, damit Stripe es erneut versucht: eine kurz nicht erreichbare
    // Datenbank darf keine Kündigung verschlucken.
    console.error("[stripe] Webhook fehlgeschlagen:", error);
    return NextResponse.json({ error: "Verarbeitung fehlgeschlagen." }, { status: 500 });
  }
}
