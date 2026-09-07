import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import {
  products,
  ProductId,
  resolveStripePriceId,
  isStripePriceConfigured
} from "@/lib/products";
import { getStripeShippingOptions } from "@/lib/shipping";
import { absoluteUrl } from "@/lib/seo";

export const runtime = "nodejs";

interface CheckoutBody {
  productId: ProductId;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutBody;
    const product = products[body.productId];

    if (!product) {
      return NextResponse.json(
        { error: "Produsul solicitat nu a fost găsit." },
        { status: 400 }
      );
    }

    if (!isStripePriceConfigured(body.productId)) {
      return NextResponse.json(
        {
          error:
            "Plățile nu sunt încă activate. Rulează yarn setup:stripe sau setează STRIPE_PRICE_* în variabilele de mediu."
        },
        { status: 503 }
      );
    }

    const stripe = getStripe();
    const stripePriceId = resolveStripePriceId(body.productId);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "ro",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1
        }
      ],
      metadata: {
        productId: product.id,
        productTitle: product.title
      },
      success_url: absoluteUrl(
        `/comanda/succes?session_id={CHECKOUT_SESSION_ID}`
      ),
      cancel_url: absoluteUrl(`/comanda/eroare`),
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["RO"]
      },
      shipping_options: getStripeShippingOptions(),
      phone_number_collection: {
        enabled: true
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Eroare la crearea sesiunii Stripe:", error);
    return NextResponse.json(
      {
        error:
          "Nu am putut iniția plata. Verifică cheile Stripe din variabilele de mediu și încearcă din nou."
      },
      { status: 500 }
    );
  }
}
