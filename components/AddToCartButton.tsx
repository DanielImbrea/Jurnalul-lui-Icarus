"use client";

import { useRouter } from "next/navigation";
import type { ProductId } from "@/lib/products";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/ToastProvider";

export default function AddToCartButton({
  productId,
  label = "Adaugă în coș",
  variant = "solid",
  goToCart = false
}: {
  productId: ProductId;
  label?: string;
  variant?: "solid" | "outline";
  goToCart?: boolean;
}) {
  const router = useRouter();
  const { addItem, getQuantity } = useCart();
  const { showToast } = useToast();

  const className =
    variant === "solid"
      ? "btn-primary w-full sm:w-auto"
      : "btn-secondary w-full sm:w-auto";

  function handleClick() {
    const previousQty = getQuantity(productId);
    addItem(productId);

    showToast(
      previousQty > 0
        ? "Cantitatea a fost actualizată în coș."
        : "Cartea a fost adăugată în coș.",
      "success"
    );

    if (goToCart && previousQty === 0) {
      router.push("/comanda");
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {label}
    </button>
  );
}
