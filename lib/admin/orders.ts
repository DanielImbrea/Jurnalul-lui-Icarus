import {
  getAdminOrders,
  getOrderProductTitles,
  type OrderPaymentFilter,
  type OrderStatusFilter
} from "@/lib/orders";

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

export async function getSerializedAdminOrders(filters?: {
  paymentMethod?: OrderPaymentFilter;
  status?: OrderStatusFilter;
}) {
  const orders = await getAdminOrders(filters);

  return orders.map((order) => ({
    id: order.id,
    email: order.email,
    customerName: order.customerName,
    phone: order.phone,
    productTitle: getOrderProductTitles(order.productId),
    formattedAddress: formatAddress(order),
    amountTotal: order.amountTotal,
    currency: order.currency,
    paymentMethod: order.paymentMethod as "card" | "cod",
    status: order.status as "PENDING" | "COMPLETED" | "CANCELLED",
    stripeSessionId: order.stripeSessionId,
    createdAt: order.createdAt.toISOString()
  }));
}
