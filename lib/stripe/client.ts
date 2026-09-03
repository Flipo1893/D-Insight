import Stripe from "stripe";
import { stripeSecretKey } from "./config";

let client: Stripe | undefined;

/**
 * Eine Stripe-Instanz pro Prozess, lazy erzeugt.
 *
 * Nicht auf Modulebene: das Modul wird auch importiert, wenn kein Key
 * gesetzt ist (etwa beim Build), und der Konstruktor wirft dann.
 */
export function getStripe(): Stripe {
  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY fehlt.");
  }

  // Ohne apiVersion nimmt das SDK die Version, für die seine Typen erzeugt
  // wurden. Genau das ist gewollt — eine fest verdrahtete ältere Version
  // würde irgendwann von den Typen abweichen.
  client ??= new Stripe(stripeSecretKey);

  return client;
}
