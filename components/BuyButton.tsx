"use client";

import { useState } from "react";
import type { ProductId } from "@/lib/products";

type Status = "idle" | "loading" | "error";

export default function BuyButton({
  productId,
  label = "Cumpără cartea",
  variant = "solid"
}: {
  productId: ProductId;
  label?: string;
  variant?: "solid" | "outline";
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleClick() {
    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "A apărut o eroare.");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  const styles =
    variant === "solid"
      ? "btn-primary disabled:opacity-60"
      : "btn-secondary disabled:opacity-60";

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleClick}
        disabled={status === "loading"}
        className={styles}
      >
        {status === "loading" ? "Se pregătește plata…" : label}
      </button>
      {status === "error" && (
        <p className="font-sans text-xs text-wine-light">
          Plata nu a putut fi inițiată. Încearcă din nou.
        </p>
      )}
    </div>
  );
}
