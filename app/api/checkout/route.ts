import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import {
  products,
  ProductId,
  resolveStripePriceId,
  isStripePriceConfigured
} from "@/lib/products";
import {
  consolidateLines,
  encodeCartLines,
  getCartProductTitles,
  type CartLine
} from "@/lib/cart";
import { getStripeShippingOptions } from "@/lib/shipping";
import { absoluteUrl } from "@/lib/seo";
import { cartLineSchema } from "@/lib/validation";
import { z } from "zod";

export const runtime = "nodejs";

const checkoutBodySchema = z.object({
  lines: z.array(cartLineSchema).min(1, "Coșul este gol.")
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutBodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Coș invalid." },
        { status: 400 }
      );
    }

    const lines = consolidateLines(parsed.data.lines as CartLine[]);

    for (const line of lines) {
      if (!products[line.productId]) {
        return NextResponse.json(
          { error: "Un produs din coș nu a fost găsit." },
          { status: 400 }
        );
      }

      if (!isStripePriceConfigured(line.productId)) {
        return NextResponse.json(
          {
            error:
              "Plățile nu sunt încă activate. Rulează yarn setup:stripe sau setează STRIPE_PRICE_* în variabilele de mediu."
          },
          { status: 503 }
        );
      }
    }

    const stripe = getStripe();
    const lineItems = lines.map((line) => ({
      price: resolveStripePriceId(line.productId as ProductId),
      quantity: line.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "ro",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      line_items: lineItems,
      metadata: {
        productIds: encodeCartLines(lines),
        productTitle: getCartProductTitles(lines)
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
