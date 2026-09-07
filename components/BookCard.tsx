import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { getBookCover } from "@/lib/book-images";
import BuyButton from "./BuyButton";
import ProductPrice from "./ProductPrice";

export default function BookCard({
  product,
  discoverLabel,
  discoverHref,
  variant = "default"
}: {
  product: Product;
  discoverLabel: string;
  discoverHref: string;
  variant?: "default" | "showcase";
}) {
  const cover =
    product.id === "bundle"
      ? getBookCover("bundle")
      : getBookCover(product.id as "blake" | "durere");

  if (variant === "showcase") {
    return (
      <article className="group overflow-hidden rounded-2xl border border-bone/10 bg-charcoal/25 transition-all duration-500 hover:border-bone/20 hover:shadow-[0_24px_64px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col md:flex-row">
          <Link
            href={discoverHref}
            className="relative block shrink-0 overflow-hidden md:w-[38%] lg:max-w-[280px]"
          >
            <div className="relative aspect-[4/5] bg-gradient-to-br from-charcoal/60 to-ink/90">
              <Image
                src={cover}
                alt={product.title}
                fill
                className="object-contain object-center p-3 transition-transform duration-700 group-hover:scale-[1.03] md:p-4"
                sizes="(max-width: 768px) 100vw, 280px"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/10 md:bg-gradient-to-r md:from-ink/20 md:via-transparent md:to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 md:bottom-4 md:left-4 md:right-4 md:top-auto md:text-left">
                <p className="inline-flex rounded-md border border-bone/10 bg-ink/70 px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.14em] text-ember backdrop-blur-sm">
                  {product.badge}
                </p>
              </div>
            </div>
          </Link>

          <div className="flex flex-1 flex-col justify-center p-6 md:p-7 lg:p-8">
            {(product.meta.publisher || product.meta.year) && (
              <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-ash/80">
                {[product.meta.publisher, product.meta.year].filter(Boolean).join(" · ")}
              </p>
            )}
            <h3 className="mt-2 font-serif text-2xl leading-tight text-bone lg:text-[1.75rem]">
              <Link href={discoverHref} className="transition-colors hover:text-ember">
                {product.title}
              </Link>
            </h3>
            <p className="mt-2 font-sans text-sm italic text-mist/85">{product.subtitle}</p>
            <p className="mt-4 line-clamp-2 font-sans text-[14px] leading-relaxed text-ash">
              {product.shortDescription}
            </p>

            <div className="mt-6 flex flex-col gap-4 border-t border-bone/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
                <ProductPrice priceRon={product.priceRon} className="!text-left [&_p:last-child]:hidden" />
                <Link
                  href={discoverHref}
                  className="pb-1 font-sans text-[12px] text-bone underline decoration-bone/30 underline-offset-4 transition-colors hover:text-ember hover:decoration-ember"
                >
                  {discoverLabel} →
                </Link>
              </div>
              <BuyButton productId={product.id} variant="outline" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-bone/10 bg-charcoal/30 transition-all duration-500 hover:border-bone/20 hover:shadow-2xl hover:shadow-black/30">
      <div className="relative mb-0 aspect-[4/5] overflow-hidden">
        <Image
          src={cover}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-ember">
            {product.badge}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-8 md:p-9">
        <h3 className="font-serif text-3xl leading-tight text-bone">{product.title}</h3>
        <p className="mt-2 font-sans text-sm text-mist/90">{product.subtitle}</p>
        <p className="mt-5 max-w-sm font-sans text-[15px] leading-relaxed text-ash">
          {product.shortDescription}
        </p>

        <div className="mt-8">
          <Link
            href={discoverHref}
            className="font-sans text-[13px] text-bone underline decoration-bone/30 underline-offset-4 transition-colors hover:text-ember hover:decoration-ember"
          >
            {discoverLabel}
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-bone/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <ProductPrice priceRon={product.priceRon} className="!text-left" />
          <BuyButton productId={product.id} variant="outline" />
        </div>
      </div>
    </article>
  );
}
