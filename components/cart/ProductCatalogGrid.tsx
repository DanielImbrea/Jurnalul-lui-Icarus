"use client";

import Image from "next/image";
import { getBookCover } from "@/lib/book-images";
import { productList, type ProductId } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";
import { useCart } from "@/components/cart/CartProvider";

function getCover(productId: ProductId) {
  return productId === "bundle"
    ? getBookCover("bundle")
    : getBookCover(productId);
}

export default function ProductCatalogGrid({
  title = "Alege ce vrei să citești"
}: {
  title?: string;
}) {
  const { getQuantity } = useCart();

  return (
    <div>
      <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-ember">
        Cărțile
      </p>
      <h2 className="mt-2 font-serif text-2xl text-bone sm:text-3xl">{title}</h2>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {productList.map((product) => {
          const quantity = getQuantity(product.id);

          return (
            <article
              key={product.id}
              className="panel-glass flex flex-col overflow-hidden p-0"
            >
              <div className="relative aspect-[4/5] overflow-hidden border-b border-bone/10 bg-gradient-to-b from-charcoal/50 to-ink/90">
                <Image
                  src={getCover(product.id)}
                  alt={product.title}
                  fill
                  className="object-contain p-4 transition-transform duration-700 hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {quantity > 0 ? (
                  <span className="absolute right-4 top-4 rounded-full border border-ember/35 bg-ink/90 px-2.5 py-1 font-sans text-[11px] text-ember">
                    ×{quantity} în coș
                  </span>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-ember">
                  {product.badge}
                </p>
                <h3 className="mt-3 font-serif text-xl leading-snug text-bone">
                  {product.title}
                </h3>
                <p className="mt-2 line-clamp-2 font-sans text-sm italic text-mist">
                  {product.subtitle}
                </p>
                <p className="mt-5 font-serif text-2xl text-bone">
                  {product.priceRon} lei
                </p>
                <div className="mt-6">
                  <AddToCartButton productId={product.id} label="Adaugă în coș" />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
