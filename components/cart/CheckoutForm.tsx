"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import ProductCatalogGrid from "@/components/cart/ProductCatalogGrid";
import { getBookCover } from "@/lib/book-images";
import { consolidateLines, getCartSubtotal } from "@/lib/cart";
import { products, type ProductId } from "@/lib/products";
import { SHIPPING_RON } from "@/lib/shipping";

type PaymentMethod = "card" | "cod";
type Status = "idle" | "loading" | "error";

function getCover(productId: ProductId) {
  return productId === "bundle"
    ? getBookCover("bundle")
    : getBookCover(productId);
}

export default function CheckoutForm() {
  const router = useRouter();
  const { cart, hydrated, clearCart } = useCart();
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const lines = consolidateLines(cart.lines);

  useEffect(() => {
    if (hydrated && lines.length === 0) {
      router.replace("/comanda");
    }
  }, [lines.length, hydrated, router]);

  if (!hydrated || lines.length === 0) {
    return (
      <div className="panel-glass animate-pulse font-sans text-sm text-ash">
        Se încarcă checkout-ul…
      </div>
    );
  }

  const subtotal = getCartSubtotal(lines);
  const total = subtotal + SHIPPING_RON;
  const cartPayload = lines.map((line) => ({
    productId: line.productId,
    quantity: line.quantity
  }));

  async function handleCardCheckout() {
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: cartPayload })
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "A apărut o eroare.");
      }

      clearCart();
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Plata cu cardul nu a putut fi inițiată."
      );
    }
  }

  async function handleCodSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const payload = {
      lines: cartPayload,
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

      clearCart();
      window.location.href = data.redirectUrl;
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Comanda nu a putut fi trimisă."
      );
    }
  }

  return (
    <div className="space-y-14">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
        <aside className="panel-glass lg:col-span-4 lg:sticky lg:top-28">
          <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-ember">
            Comanda ta
          </p>

          <ul className="mt-5 space-y-4">
            {lines.map((line) => {
              const product = products[line.productId];

              return (
                <li key={line.productId} className="flex gap-3">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-bone/10">
                    <Image
                      src={getCover(line.productId)}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-base leading-snug text-bone">
                      {product.title}
                    </p>
                    <p className="mt-1 font-sans text-xs text-ash">
                      {line.quantity > 1
                        ? `${line.quantity} × ${product.priceRon} lei`
                        : `${product.priceRon} lei`}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-bone/10 pt-5 font-sans text-sm">
            <div className="flex justify-between gap-4 text-mist">
              <dt>Produse</dt>
              <dd>{subtotal} lei</dd>
            </div>
            <div className="flex justify-between gap-4 text-mist">
              <dt>Transport</dt>
              <dd>{SHIPPING_RON} lei</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-bone/10 pt-3">
              <dt className="font-serif text-lg text-bone">Total</dt>
              <dd className="font-serif text-xl text-bone">{total} lei</dd>
            </div>
          </dl>

          <Link
            href="/comanda"
            className="mt-6 inline-block font-sans text-xs text-ash underline decoration-bone/20 underline-offset-4 transition-colors hover:text-bone"
          >
            ← Înapoi la coș
          </Link>
        </aside>

        <div className="lg:col-span-8">
          <div className="panel-glass">
            <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-ember">
              Metodă de plată
            </p>
            <h2 className="mt-2 font-serif text-2xl text-bone">
              Alege cum vrei să plătești
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <PaymentOption
                active={method === "card"}
                onClick={() => {
                  setMethod("card");
                  setErrorMsg("");
                }}
                title="Card bancar"
                description="Plată securizată prin Stripe. Vei completa datele pe pagina Stripe."
                badge="Recomandat"
              />
              <PaymentOption
                active={method === "cod"}
                onClick={() => {
                  setMethod("cod");
                  setErrorMsg("");
                }}
                title="Ramburs la curier"
                description="Plătești numerar curierului când primești coletul."
              />
            </div>
          </div>

          <div className="panel-glass mt-6">
            {method === "card" ? (
              <div className="space-y-5">
                <div>
                  <p className="font-serif text-xl text-bone">Plata cu cardul</p>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-ash">
                    Vei fi redirecționat către Stripe pentru a introduce datele
                    cardului și adresa de livrare în siguranță.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCardCheckout}
                  disabled={status === "loading"}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {status === "loading"
                    ? "Se pregătește plata…"
                    : `Continuă la Stripe · ${total} lei`}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="font-serif text-xl text-bone">Ramburs la curier</p>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-ash">
                    Completează datele de livrare. Vei plăti{" "}
                    <span className="text-mist">{total} lei</span> numerar
                    curierului la primirea coletului.
                  </p>
                </div>

                <form onSubmit={handleCodSubmit} className="space-y-4">
                  <Field label="Nume complet" name="customerName" required />
                  <Field label="Email" name="email" type="email" required />
                  <Field label="Telefon" name="phone" type="tel" required />
                  <Field label="Adresă" name="addressLine1" required />
                  <Field
                    label="Adresă linia 2 (opțional)"
                    name="addressLine2"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Localitate" name="city" required />
                    <Field label="Cod poștal" name="postalCode" required />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-primary w-full disabled:opacity-60"
                  >
                    {status === "loading"
                      ? "Se trimite comanda…"
                      : `Confirmă ramburs · ${total} lei`}
                  </button>
                </form>
              </div>
            )}

            {status === "error" && errorMsg ? (
              <p className="mt-4 font-sans text-sm text-wine-light">{errorMsg}</p>
            ) : null}
          </div>
        </div>
      </div>

      <ProductCatalogGrid title="Adaugă și alte titluri înainte de plată" />
    </div>
  );
}

function PaymentOption({
  active,
  onClick,
  title,
  description,
  badge
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-5 text-left transition-all duration-300 ${
        active
          ? "border-ember/50 bg-ember/10 ring-1 ring-ember/25"
          : "border-bone/10 bg-black/20 hover:border-bone/25 hover:bg-black/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-serif text-lg text-bone">{title}</p>
        {badge ? (
          <span className="shrink-0 rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.12em] text-ember">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-2 font-sans text-sm leading-relaxed text-ash">
        {description}
      </p>
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-sans text-xs text-ash">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="input-field !mt-0"
      />
    </label>
  );
}
