"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import ProductCatalogGrid from "@/components/cart/ProductCatalogGrid";
import { getBookCover } from "@/lib/book-images";
import { consolidateLines, getCartSubtotal } from "@/lib/cart";
import { products, type ProductId } from "@/lib/products";
import { SHIPPING_RON } from "@/lib/shipping";

function getCover(productId: ProductId) {
  return productId === "bundle"
    ? getBookCover("bundle")
    : getBookCover(productId);
}

export default function CartView() {
  const { cart, hydrated, addItem, decreaseItem, removeItem } = useCart();
  const lines = consolidateLines(cart.lines);

  if (!hydrated) {
    return (
      <div className="panel-glass animate-pulse font-sans text-sm text-ash">
        Se încarcă coșul…
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="space-y-12">
        <div className="panel-glass text-center">
          <p className="font-serif text-2xl text-bone">Coșul tău este gol</p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ash">
            Alege o carte sau pachetul complet și continuă spre finalizare.
          </p>
        </div>

        <ProductCatalogGrid />
      </div>
    );
  }

  const subtotal = getCartSubtotal(lines);
  const total = subtotal + SHIPPING_RON;

  return (
    <div className="space-y-14">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
        <div className="space-y-4 lg:col-span-7">
          {lines.map((line) => {
            const product = products[line.productId];
            const lineTotal = product.priceRon * line.quantity;

            return (
              <div key={line.productId} className="panel-glass">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="relative mx-auto aspect-[3/4] w-full max-w-[140px] shrink-0 overflow-hidden rounded-xl border border-bone/10 bg-charcoal/40 sm:mx-0">
                    <Image
                      src={getCover(line.productId)}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="140px"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-ember">
                      {product.badge}
                    </p>
                    <h2 className="mt-2 font-serif text-xl leading-snug text-bone sm:text-2xl">
                      {product.title}
                    </h2>
                    <p className="mt-2 font-sans text-sm italic text-mist">
                      {product.subtitle}
                    </p>
                    <p className="mt-4 font-serif text-xl text-bone">
                      {product.priceRon} lei
                      {line.quantity > 1 ? (
                        <span className="ml-2 font-sans text-sm text-ash">
                          × {line.quantity} = {lineTotal} lei
                        </span>
                      ) : null}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center rounded-lg border border-bone/15 bg-black/25">
                        <button
                          type="button"
                          onClick={() => decreaseItem(line.productId)}
                          className="px-3 py-2 font-sans text-sm text-bone transition-colors hover:text-ember"
                          aria-label="Scade cantitatea"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] px-2 text-center font-sans text-sm text-bone">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => addItem(line.productId)}
                          className="px-3 py-2 font-sans text-sm text-bone transition-colors hover:text-ember"
                          aria-label="Crește cantitatea"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.productId)}
                        className="font-sans text-xs text-ash underline decoration-bone/20 underline-offset-4 transition-colors hover:text-wine-light"
                      >
                        Elimină
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="panel-glass lg:col-span-5 lg:sticky lg:top-28">
          <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-ember">
            Sumar comandă
          </p>

          <dl className="mt-5 space-y-3 font-sans text-sm">
            {lines.map((line) => (
              <div
                key={line.productId}
                className="flex items-center justify-between gap-4 text-mist"
              >
                <dt className="min-w-0 truncate">
                  {products[line.productId].title}
                  {line.quantity > 1 ? ` ×${line.quantity}` : ""}
                </dt>
                <dd className="shrink-0">
                  {products[line.productId].priceRon * line.quantity} lei
                </dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 text-mist">
              <dt>Transport</dt>
              <dd>{SHIPPING_RON} lei</dd>
            </div>
            <div className="border-t border-bone/10 pt-3">
              <div className="flex items-center justify-between gap-4">
                <dt className="font-serif text-lg text-bone">Total</dt>
                <dd className="font-serif text-2xl text-bone">{total} lei</dd>
              </div>
            </div>
          </dl>

          <Link href="/comanda/finalizare" className="btn-primary mt-8 w-full">
            Finalizare comandă
          </Link>

          <Link
            href="/carti"
            className="mt-4 block text-center font-sans text-xs text-ash underline decoration-bone/20 underline-offset-4 transition-colors hover:text-bone"
          >
            Continuă cumpărăturile
          </Link>
        </aside>
      </div>

      <ProductCatalogGrid title="Adaugă și alte titluri" />
    </div>
  );
}
