import Image from "next/image";
import Link from "next/link";

const FALLBACK_MOMENTS = [
  {
    src: "/books/blake/7.png",
    alt: "Sub Umbrele lui Blake — moment de lectură"
  },
  {
    src: "/books/blake/3.png",
    alt: "Sub Umbrele lui Blake — atmosferă"
  },
  {
    src: "/books/durere/02.png",
    alt: "Îmbrățișarea Durerii — moment de lectură"
  }
] as const;

type GalleryPhoto = {
  id: string;
  imageUrl: string;
  name: string;
};

function MomentImage({
  src,
  alt,
  className = "",
  objectPosition = "center"
}: {
  src: string;
  alt: string;
  className?: string;
  objectPosition?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-bone/10 shadow-[0_16px_48px_rgba(0,0,0,0.45)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        style={{ objectPosition }}
        sizes="(max-width: 1024px) 45vw, 280px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/10" />
    </div>
  );
}

export default function ReaderMomentsVisual({ photos }: { photos: GalleryPhoto[] }) {
  const items =
    photos.length >= 3
      ? photos.slice(0, 3).map((photo) => ({
          key: photo.id,
          src: photo.imageUrl,
          alt: `Fotografie de la ${photo.name}`
        }))
      : FALLBACK_MOMENTS.map((item) => ({ key: item.src, src: item.src, alt: item.alt }));

  return (
    <Link
      href="/galeria-cititorilor"
      className="group block"
      aria-label="Vezi galeria Cititorii lui Icarus"
    >
      <div className="reader-moments-frame relative rounded-2xl border border-bone/10 bg-ink/30 p-3 sm:p-4">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-12 sm:gap-3">
          <MomentImage
            src={items[0].src}
            alt={items[0].alt}
            className="col-span-2 aspect-[4/5] sm:col-span-5 sm:row-span-2 sm:aspect-auto sm:min-h-[320px]"
            objectPosition="center 35%"
          />
          <MomentImage
            src={items[1].src}
            alt={items[1].alt}
            className="aspect-[4/5] sm:col-span-7 sm:aspect-[5/4]"
          />
          <MomentImage
            src={items[2].src}
            alt={items[2].alt}
            className="aspect-[4/5] sm:col-span-7 sm:aspect-[5/4]"
          />
        </div>

        <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-lg border border-bone/10 bg-ink/70 px-4 py-3 backdrop-blur-md sm:inset-x-5 sm:bottom-5">
          <p className="font-serif text-sm italic text-bone/90 sm:text-base">
            Unde a ajuns cartea ta?
          </p>
          <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.16em] text-ember/80">
            Galeria cititorilor
          </p>
        </div>
      </div>

      <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.16em] text-ash transition-colors group-hover:text-mist">
        Vezi comunitatea →
      </p>
    </Link>
  );
}
