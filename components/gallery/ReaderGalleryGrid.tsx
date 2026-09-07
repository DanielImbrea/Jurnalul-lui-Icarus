"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { products } from "@/lib/products";

export interface GalleryPhoto {
  id: string;
  bookId: string;
  name: string;
  imageUrl: string;
  caption?: string | null;
  featured?: boolean;
}

interface ReaderGalleryGridProps {
  photos: GalleryPhoto[];
}

export default function ReaderGalleryGrid({ photos }: ReaderGalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    if (activeIndex === null) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length));
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) =>
          i === null ? null : (i - 1 + photos.length) % photos.length
        );
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeIndex, close, photos.length]);

  if (photos.length === 0) {
    return null;
  }

  const active = activeIndex !== null ? photos[activeIndex] : null;
  const book = active ? products[active.bookId as keyof typeof products] : null;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => {
          const photoBook = products[photo.bookId as keyof typeof products];

          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group block w-full text-left transition-colors hover:border-ember/25"
            >
              <div className="relative overflow-hidden rounded-xl border border-bone/10 transition-colors group-hover:border-ember/20">
                <div className="relative aspect-[3/2] w-full bg-gradient-to-b from-charcoal/70 to-black/80">
                  <Image
                    src={photo.imageUrl}
                    alt={`Fotografie de la ${photo.name}`}
                    fill
                    className="object-contain p-3 transition-transform duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {photo.featured && (
                    <span className="absolute left-3 top-3 rounded-full border border-ember/40 bg-black/60 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.12em] text-ember backdrop-blur-sm">
                      Featured
                    </span>
                  )}
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3 font-sans text-[10px] uppercase tracking-[0.14em] text-bone/0 transition-colors group-hover:text-bone/70">
                    Mărește
                  </span>
                </div>
                <div className="border-t border-bone/10 bg-charcoal/60 p-5">
                  <p className="font-sans text-[13px] text-bone">{photo.name}</p>
                  {photoBook && (
                    <p className="mt-1 font-sans text-[11px] text-ash">
                      {photoBook.title}
                    </p>
                  )}
                  {photo.caption && (
                    <p className="mt-3 font-serif text-sm leading-relaxed text-mist line-clamp-2">
                      {photo.caption}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Fotografie cititor"
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-6 top-6 font-sans text-sm text-ash hover:text-bone"
            aria-label="Închide"
          >
            Închide
          </button>

          <div
            className="grid w-full max-w-7xl max-h-[92vh] gap-6 overflow-auto px-2 md:grid-cols-[1.55fr_1fr] md:gap-10 md:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[62vh] w-full md:h-[80vh]">
              <Image
                src={active.imageUrl}
                alt={`Fotografie de la ${active.name}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 75vw"
                priority
              />
            </div>

            <div className="flex flex-col justify-center pb-6 md:pb-0 md:pr-4">
              <p className="font-sans text-[13px] text-ember">Cititorii lui Icarus</p>
              <p className="mt-3 font-serif text-2xl text-bone">{active.name}</p>
              {book && (
                <p className="mt-2 font-sans text-sm text-ash">{book.title}</p>
              )}
              {active.caption && (
                <p className="mt-6 font-serif text-lg leading-relaxed text-mist">
                  {active.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
