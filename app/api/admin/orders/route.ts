import { NextRequest, NextResponse } from "next/server";
import {
  getAdminOrders,
  getOrderProductTitles,
  type OrderPaymentFilter,
  type OrderStatusFilter
} from "@/lib/orders";

export const runtime = "nodejs";

function formatAddress(order: {
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  postalCode: string | null;
}) {
  const parts = [
    order.addressLine1,
    order.addressLine2,
    [order.postalCode, order.city].filter(Boolean).join(" "),
    "România"
  ].filter(Boolean);

  return parts.length > 1 ? parts.join(", ") : null;
}

export async function GET(req: NextRequest) {
  const paymentMethod = req.nextUrl.searchParams.get(
    "paymentMethod"
  ) as OrderPaymentFilter | null;
  const status = req.nextUrl.searchParams.get("status") as OrderStatusFilter | null;

  const orders = await getAdminOrders({
    paymentMethod: paymentMethod ?? undefined,
    status: status ?? undefined
  });

  return NextResponse.json(
    orders.map((order) => ({
      ...order,
      productTitle: getOrderProductTitles(order.productId),
      formattedAddress: formatAddress(order)
    }))
  );
}
