import { prisma } from "@/lib/db";
import type { BookId } from "@/lib/validation";
import type Stripe from "stripe";

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
      status: "COMPLETED"
    },
    update: {
      email: email.toLowerCase(),
      customerName: session.customer_details?.name ?? null,
      productId,
      amountTotal: session.amount_total ?? 0,
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
