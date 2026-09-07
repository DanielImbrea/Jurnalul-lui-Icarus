"use client";

import { useState } from "react";
import type { ProductId } from "@/lib/products";
import { products } from "@/lib/products";
import { formatTotalWithShipping, SHIPPING_RON } from "@/lib/shipping";

type Status = "idle" | "loading" | "error" | "cod-form";

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
  const [errorMsg, setErrorMsg] = useState("");
  const product = products[productId];

  async function handleCardCheckout() {
    setStatus("loading");
    setErrorMsg("");
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
      setErrorMsg("Plata cu cardul nu a putut fi inițiată.");
    }
  }

  async function handleCodSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const payload = {
      productId,
      customerName: form.get("customerName"),
      email: form.get("email"),
      phone: form.get("phone"),
      addressLine1: form.get("addressLine1"),
      addressLine2: form.get("addressLine2") || "",
      city: form.get("city"),
      postalCode: form.get("postalCode")
    };

    try {
      const res = await fetch("/api/orders/cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || !data.redirectUrl) {
        throw new Error(data.error || "Comanda nu a putut fi trimisă.");
      }

      window.location.href = data.redirectUrl;
    } catch (err) {
      console.error(err);
      setStatus("cod-form");
      setErrorMsg(
        err instanceof Error ? err.message : "Comanda nu a putut fi trimisă."
      );
    }
  }

  const primaryBtn =
    variant === "solid"
      ? "btn-primary disabled:opacity-60 w-full"
      : "btn-secondary disabled:opacity-60 w-full";
  const secondaryBtn = "btn-secondary disabled:opacity-60 w-full";

  if (status === "cod-form" || (status === "loading" && errorMsg)) {
    return (
      <div className="w-full max-w-md space-y-4 border border-bone/10 bg-charcoal/50 p-5">
        <div>
          <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-ember">
            Ramburs la curier
          </p>
          <p className="mt-1 font-serif text-lg text-bone">{product.title}</p>
          <p className="mt-1 font-sans text-sm text-ash">
            Total: {formatTotalWithShipping(product.priceRon)} lei (inclusiv{" "}
            {SHIPPING_RON} lei transport)
          </p>
        </div>

        <form onSubmit={handleCodSubmit} className="space-y-3">
          <Field label="Nume complet" name="customerName" required />
          <Field label="Email" name="email" type="email" required />
          <Field
            label="Telefon"
            name="phone"
            type="tel"
            required
            placeholder=""
          />
          <Field label="Adresă" name="addressLine1" required />
          <Field
            label="Adresă linia 2 (opțional)"
            name="addressLine2"
            placeholder=""
          />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Localitate" name="city" required />
            <Field label="Cod poștal" name="postalCode" required />
          </div>

          <p className="font-sans text-xs leading-relaxed text-ash">
            Plătești numerar curierului la livrare. Vei primi confirmarea pe
            email.
          </p>

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="submit"
              disabled={status === "loading"}
              className={primaryBtn}
            >
              {status === "loading" ? "Se trimite comanda…" : "Confirmă ramburs"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setErrorMsg("");
              }}
              className={secondaryBtn}
            >
              Înapoi
            </button>
          </div>
        </form>

        {errorMsg ? (
          <p className="font-sans text-xs text-wine-light">{errorMsg}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col items-stretch gap-2">
      <button
        onClick={handleCardCheckout}
        disabled={status === "loading"}
        className={primaryBtn}
      >
        {status === "loading" ? "Se pregătește plata…" : label}
      </button>
      <button
        onClick={() => {
          setStatus("cod-form");
          setErrorMsg("");
        }}
        disabled={status === "loading"}
        className={secondaryBtn}
      >
        Ramburs la curier
      </button>
      {status === "error" && errorMsg ? (
        <p className="font-sans text-xs text-wine-light">{errorMsg}</p>
      ) : null}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-sans text-xs text-ash">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border border-bone/15 bg-ink/40 px-3 py-2.5 font-sans text-sm text-bone placeholder:text-ash/50 focus:border-ember/40 focus:outline-none"
      />
    </label>
  );
}
