import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, type OrderStatusFilter } from "@/lib/orders";
import { z } from "zod";

export const runtime = "nodejs";

const patchSchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"])
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = patchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Date invalide." },
        { status: 400 }
      );
    }

    const order = await updateOrderStatus(
      params.id,
      parsed.data.status as OrderStatusFilter
    );

    return NextResponse.json(order);
  } catch (error) {
    console.error("Eroare actualizare comandă:", error);
    return NextResponse.json(
      { error: "Nu am putut actualiza comanda." },
      { status: 500 }
    );
  }
}
