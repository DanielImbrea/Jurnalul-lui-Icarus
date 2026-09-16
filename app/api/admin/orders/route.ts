import { NextRequest, NextResponse } from "next/server";
import { getSerializedAdminOrders } from "@/lib/admin/orders";
import type { OrderPaymentFilter, OrderStatusFilter } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const paymentMethod = req.nextUrl.searchParams.get(
      "paymentMethod"
    ) as OrderPaymentFilter | null;
    const status = req.nextUrl.searchParams.get("status") as OrderStatusFilter | null;

    const orders = await getSerializedAdminOrders({
      paymentMethod: paymentMethod ?? undefined,
      status: status ?? undefined
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Eroare listare comenzi admin:", error);
    return NextResponse.json(
      { error: "Nu am putut încărca comenzile." },
      { status: 500 }
    );
  }
}
