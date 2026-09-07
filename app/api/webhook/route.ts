import { NextRequest, NextResponse } from "next/server";
import { saveOrderFromStripeSession } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

export const runtime = "nodejs";

// Endpoint pentru Stripe CLI / Dashboard -> Developers -> Webhooks.
// URL de configurat: https://TAU-DOMENIU/api/webhook
// Evenimente recomandate: checkout.session.completed
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET lipsește din variabilele de mediu." },
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    if (!signature) throw new Error("Semnătura Stripe lipsește din header.");
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Semnătură webhook invalidă:", err);
    return NextResponse.json({ error: "Semnătură invalidă." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      try {
        await saveOrderFromStripeSession(session);
      } catch (err) {
        console.error("Eroare salvare comandă:", err);
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
