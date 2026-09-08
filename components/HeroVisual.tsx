import Image from "next/image";
import Link from "next/link";
import { blakeFeaturedImages, durereFeaturedImages } from "@/lib/book-images";

/** Placeholder blur pentru încărcare instant — ton wine/charcoal */
const HERO_BLUR =
  "data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAADwAwCdASoQABkAPzmEuVOvKKWisAgB4CcJaACdABuYrRO7d+0awkwAAP7NxFh54GoW+4kFQpyzRWzOdCC6B5ucTWPNv4KgxBxCYzGYP9BNBZqsJsGj1Qpx7KeUNwIFbOSJNjAiZ/q9hECpdTK5L/2RsznAPh+wAAA=";

type HeroBookPanelProps = {
  href: string;
  src: string;
  alt: string;
  label: string;
  tilt?: "left" | "right";
  className?: string;
  delay?: string;
  /** Doar imaginea LCP (prima) — priority + preload */
  primary?: boolean;
  /** Fade-in la load (dezactivat când părintele are deja reveal) */
  reveal?: boolean;
};

function HeroBookPanel({
  href,
  src,
  alt,
  label,
  tilt = "left",
  className = "",
  delay = "0.2s",
  primary = false,
  reveal = true
}: HeroBookPanelProps) {
  const rotation = tilt === "left" ? "-rotate-[2.5deg]" : "rotate-[2.5deg]";

  return (
    <Link
      href={href}
      className={`${reveal ? "reveal-on-load" : ""} group block w-full max-w-[400px] justify-self-center ${className}`}
      style={{ animationDelay: delay }}
      aria-label={label}
    >
      <div
        className={`hero-book-panel relative overflow-hidden rounded-2xl border border-bone/12 shadow-[0_28px_80px_rgba(0,0,0,0.55)] transition-transform duration-700 hover:scale-[1.02] ${rotation}`}
      >
        <div className="relative aspect-[3/4] bg-charcoal/80">
          <Image
            src={src}
            alt={alt}
            fill
            priority={primary}
            fetchPriority={primary ? "high" : "auto"}
            loading={primary ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL={HERO_BLUR}
            unoptimized
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 1024px) 42vw, 400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-ink/25 via-transparent to-ink/20" />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <span className="inline-flex rounded-md border border-bone/10 bg-ink/75 px-2.5 py-1.5 font-sans text-[9px] uppercase tracking-[0.16em] text-bone backdrop-blur-md">
            {label}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function HeroBooksMobile({ className = "" }: { className?: string }) {
  return (
    <div
      className={`reveal-on-load grid grid-cols-2 gap-3 sm:gap-4 lg:hidden ${className}`}
      style={{ animationDelay: "0.18s" }}
    >
      <HeroBookPanel
        href="/carti/sub-umbrele-lui-blake"
        src={blakeFeaturedImages.hero}
        alt="Sub Umbrele lui Blake"
        label="Dark romance"
        tilt="left"
        primary
        reveal={false}
        delay="0s"
      />
      <HeroBookPanel
        href="/carti/imbratisarea-durerii-si-avantajele-ei"
        src={durereFeaturedImages.hero}
        alt="Îmbrățișarea Durerii și Avantajele ei"
        label="Reflecție"
        tilt="right"
        primary
        reveal={false}
        className="mt-4 sm:mt-6"
        delay="0s"
      />
    </div>
  );
}

export function HeroBookLeft() {
  return (
    <HeroBookPanel
      href="/carti/sub-umbrele-lui-blake"
      src={blakeFeaturedImages.hero}
      alt="Sub Umbrele lui Blake"
      label="Sub Umbrele lui Blake"
      tilt="left"
      primary
      className="hidden lg:block"
      delay="0.15s"
    />
  );
}

export function HeroBookRight() {
  return (
    <HeroBookPanel
      href="/carti/imbratisarea-durerii-si-avantajele-ei"
      src={durereFeaturedImages.hero}
      alt="Îmbrățișarea Durerii și Avantajele ei"
      label="Îmbrățișarea Durerii"
      tilt="right"
      className="hidden lg:block lg:mt-10"
      delay="0.25s"
    />
  );
}
