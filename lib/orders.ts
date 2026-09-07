import { prisma } from "@/lib/db";
import type { BookId } from "@/lib/validation";
import type { ProductId } from "@/lib/products";
import { products } from "@/lib/products";
import { SHIPPING_RON } from "@/lib/shipping";
import type Stripe from "stripe";

export interface CodOrderInput {
  productId: ProductId;
  customerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
}

export async function createCodOrder(input: CodOrderInput) {
  const product = products[input.productId];
  const amountTotal = (product.priceRon + SHIPPING_RON) * 100;

  return prisma.order.create({
    data: {
      email: input.email.toLowerCase(),
      customerName: input.customerName,
      phone: input.phone,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2 || null,
      city: input.city,
      postalCode: input.postalCode,
      productId: input.productId,
      amountTotal,
      currency: "ron",
      paymentMethod: "cod",
      status: "PENDING",
      stripeSessionId: null
    }
  });
}

export async function saveOrderFromStripeSession(
  session: Stripe.Checkout.Session
): Promise<void> {
  const email =
    session.customer_details?.email || session.customer_email || null;
  const productId = session.metadata?.productId;

  if (!email || !productId) return;

  await prisma.order.upsert({
    where: { stripeSessionId: session.id },
    create: {
      id: session.id,
      stripeSessionId: session.id,
      email: email.toLowerCase(),
      customerName: session.customer_details?.name ?? null,
      productId,
      amountTotal: session.amount_total ?? 0,
      currency: session.currency ?? "ron",
      paymentMethod: "card",
      status: "COMPLETED"
    },
    update: {
      email: email.toLowerCase(),
      customerName: session.customer_details?.name ?? null,
      productId,
      amountTotal: session.amount_total ?? 0,
      paymentMethod: "card",
      status: "COMPLETED"
    }
  });
}

export async function findVerifiedOrderForBook(
  email: string,
  bookId: BookId
): Promise<{ orderId: string } | null> {
  const normalizedEmail = email.toLowerCase();

  const directOrder = await prisma.order.findFirst({
    where: {
      email: normalizedEmail,
      productId: bookId,
      status: "COMPLETED"
    },
    orderBy: { createdAt: "desc" }
  });

  if (directOrder) {
    return { orderId: directOrder.id };
  }

  const bundleOrder = await prisma.order.findFirst({
    where: {
      email: normalizedEmail,
      productId: "bundle",
      status: "COMPLETED"
    },
    orderBy: { createdAt: "desc" }
  });

  if (bundleOrder) {
    return { orderId: bundleOrder.id };
  }

  return null;
}
