import { NextRequest, NextResponse } from "next/server";
import { createCodOrder, getOrderLines } from "@/lib/orders";
import {
  getOrderTotalFromLines,
  sendOrderConfirmationEmail
} from "@/lib/order-email";
import { consolidateLines } from "@/lib/cart";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { codOrderSchema, sanitizeText } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`cod-order:${ip}`, { windowMs: 60_000, max: 5 });

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Prea multe încercări. Încearcă din nou peste un minut." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = codOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Date invalide." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const lines = consolidateLines(data.lines);
    const order = await createCodOrder({
      lines,
      customerName: sanitizeText(data.customerName),
      email: sanitizeText(data.email),
      phone: sanitizeText(data.phone),
      addressLine1: sanitizeText(data.addressLine1),
      addressLine2: data.addressLine2 ? sanitizeText(data.addressLine2) : undefined,
      city: sanitizeText(data.city),
      postalCode: sanitizeText(data.postalCode)
    });

    await sendOrderConfirmationEmail({
      to: order.email,
      customerName: order.customerName,
      lines: getOrderLines(order.productId),
      totalRon: order.amountTotal / 100,
      paymentMethod: "cod",
      orderId: order.id
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      redirectUrl: `/comanda/succes?cod=${order.id}`
    });
  } catch (error) {
    console.error("Eroare comandă ramburs:", error);
    return NextResponse.json(
      { error: "Nu am putut înregistra comanda. Încearcă din nou." },
      { status: 500 }
    );
  }
}
