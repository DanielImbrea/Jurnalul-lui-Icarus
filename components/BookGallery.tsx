"use client";

import { useState } from "react";
import Image from "next/image";

interface BookGalleryProps {
  images: readonly string[];
  title: string;
}

export default function BookGallery({ images, title }: BookGalleryProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="mt-16">
      <p className="font-sans text-[12px] uppercase tracking-[0.16em] text-ash">
        Atmosferă
      </p>

      <div className="relative mt-5 aspect-[4/5] overflow-hidden rounded-xl border border-bone/10 bg-charcoal/40">
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${title} — fotografie ${active + 1}`}
          fill
          className="object-contain p-2 transition-opacity duration-700"
          sizes="(max-width: 768px) 100vw, 420px"
          priority={active === 0}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Imagine ${index + 1}`}
              className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-md border transition-all ${
                active === index
                  ? "border-ember ring-1 ring-ember/30"
                  : "border-bone/10 opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="56px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
