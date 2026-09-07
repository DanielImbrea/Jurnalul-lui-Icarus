import Stripe from "stripe";

// Instanțiat lazy ca build-ul să nu eșueze dacă variabila de mediu
// lipsește temporar în preview-uri Vercel fără Stripe configurat.
let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY lipsește din variabilele de mediu. Adaugă-l în .env.local sau în Vercel > Settings > Environment Variables."
      );
    }
    stripeClient = new Stripe(key, {
      apiVersion: "2024-06-20"
    });
  }
  return stripeClient;
}
