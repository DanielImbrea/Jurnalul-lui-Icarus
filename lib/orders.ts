import { prisma, withDbFallback } from "@/lib/db";
import type { BookId } from "@/lib/validation";
import type { ProductId } from "@/lib/products";
import { products } from "@/lib/products";
import {
  consolidateLines,
  encodeCartLines,
  getCartSubtotal,
  parseCartLines,
  type CartLine
} from "@/lib/cart";
import { SHIPPING_RON } from "@/lib/shipping";
import type Stripe from "stripe";

export interface CodOrderInput {
  lines: CartLine[];
  customerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
}

export async function createCodOrder(input: CodOrderInput) {
  const lines = consolidateLines(input.lines);
  const amountTotal = (getCartSubtotal(lines) + SHIPPING_RON) * 100;

  return prisma.order.create({
    data: {
      email: input.email.toLowerCase(),
      customerName: input.customerName,
      phone: input.phone,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2 || null,
      city: input.city,
      postalCode: input.postalCode,
      productId: encodeCartLines(lines),
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
  const productIdsRaw =
    session.metadata?.productIds ?? session.metadata?.productId ?? null;

  if (!email || !productIdsRaw) return;

  const shipping = session.shipping_details;
  const customer = session.customer_details;
  const address = shipping?.address ?? customer?.address ?? null;

  const orderData = {
    email: email.toLowerCase(),
    customerName: shipping?.name ?? customer?.name ?? null,
    phone: customer?.phone ?? null,
    addressLine1: address?.line1 ?? null,
    addressLine2: address?.line2 ?? null,
    city: address?.city ?? null,
    postalCode: address?.postal_code ?? null,
    productId: productIdsRaw,
    amountTotal: session.amount_total ?? 0,
    currency: session.currency ?? "ron",
    paymentMethod: "card",
    status: "COMPLETED"
  };

  await prisma.order.upsert({
    where: { stripeSessionId: session.id },
    create: {
      id: session.id,
      stripeSessionId: session.id,
      ...orderData
    },
    update: orderData
  });
}

export type OrderPaymentFilter = "card" | "cod";
export type OrderStatusFilter = "PENDING" | "COMPLETED" | "CANCELLED";

export async function getAdminOrders(filters?: {
  paymentMethod?: OrderPaymentFilter;
  status?: OrderStatusFilter;
}) {
  return withDbFallback(
    () =>
      prisma.order.findMany({
        where: {
          ...(filters?.paymentMethod ? { paymentMethod: filters.paymentMethod } : {}),
          ...(filters?.status ? { status: filters.status } : {})
        },
        orderBy: { createdAt: "desc" },
        take: 200
      }),
    []
  );
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatusFilter
) {
  return prisma.order.update({
    where: { id },
    data: { status }
  });
}

export async function countPendingCodOrders() {
  return withDbFallback(
    () =>
      prisma.order.count({
        where: { paymentMethod: "cod", status: "PENDING" }
      }),
    0
  );
}

function orderIncludesBook(productIdField: string, bookId: BookId): boolean {
  const lines = parseCartLines(productIdField);

  if (lines.length === 0) {
    return productIdField === bookId || productIdField === "bundle";
  }

  return lines.some(
    (line) => line.productId === bookId || line.productId === "bundle"
  );
}

export async function findVerifiedOrderForBook(
  email: string,
  bookId: BookId
): Promise<{ orderId: string } | null> {
  const normalizedEmail = email.toLowerCase();

  const orders = await prisma.order.findMany({
    where: {
      email: normalizedEmail,
      status: "COMPLETED"
    },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  const match = orders.find((order) =>
    orderIncludesBook(order.productId, bookId)
  );

  return match ? { orderId: match.id } : null;
}

export function getOrderProductTitles(productIdField: string): string {
  const lines = parseCartLines(productIdField);

  if (lines.length === 0) {
    const single = products[productIdField as ProductId];
    return single?.title ?? productIdField;
  }

  return lines
    .map((line) => {
      const title = products[line.productId].title;
      return line.quantity > 1 ? `${title} ×${line.quantity}` : title;
    })
    .join(" + ");
}

export function getOrderLines(productIdField: string): CartLine[] {
  const lines = parseCartLines(productIdField);
  if (lines.length > 0) return lines;

  if (products[productIdField as ProductId]) {
    return [{ productId: productIdField as ProductId, quantity: 1 }];
  }

  return [];
}
