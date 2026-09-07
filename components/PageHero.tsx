import type { ReactNode } from "react";
import Atmosphere from "./Atmosphere";
import PageAtmosphere from "./PageAtmosphere";

function HeroScrollLink({ href, label }: { href: string; label: string }) {
  return (
    <>
      <a
        href={href}
        className="hero-scroll-link group mb-1 hidden shrink-0 flex-col items-center gap-2 text-center sm:flex"
        aria-label={label}
      >
        <span className="max-w-[9rem] font-sans text-[12px] leading-snug text-bone transition-colors group-hover:text-ember">
          {label}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/15 bg-black/25 transition-colors group-hover:border-ember/40 group-hover:text-ember">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </a>

      <a
        href={href}
        className="hero-scroll-link group absolute bottom-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-bone/15 bg-black/25 text-ash transition-colors hover:border-ember/40 hover:text-ember sm:hidden"
        aria-label={label}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </>
  );
}

export default function PageHero({
  eyebrow,
  title,
  description,
  atmosphere = "neutral",
  compact = false,
  scrollTo
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  atmosphere?: "blake" | "durere" | "neutral";
  compact?: boolean;
  scrollTo?: { href: string; label: string };
}) {
  return (
    <section
      className={`relative flex items-end overflow-hidden border-b border-bone/10 ${
        compact ? "min-h-0 pb-10 pt-32" : "min-h-[52vh] pb-16 pt-40"
      }`}
    >
      <div className="wine-gradient-base absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[45%] bg-gradient-to-b from-transparent to-black" />
      <Atmosphere variant={atmosphere} className="opacity-80" />
      <PageAtmosphere smoke={8} dust="medium" shootingStars={1} subtle={false} />
      <div className="container-editorial relative z-10 w-full">
        <div
          className={
            scrollTo ? "flex items-end justify-between gap-8 lg:gap-12" : undefined
          }
        >
          <div className="min-w-0 flex-1">
            <p className="font-sans text-[13px] text-ember">{eyebrow}</p>
            <h1
              className={`mt-4 text-balance font-serif leading-tight text-bone ${
                compact
                  ? "max-w-3xl text-4xl sm:text-5xl"
                  : "max-w-2xl text-4xl sm:text-5xl lg:text-6xl"
              }`}
            >
              {title}
            </h1>
            {description ? (
              <div className="mt-5 max-w-2xl space-y-4 font-sans text-[15px] leading-relaxed text-mist">
                {description}
              </div>
            ) : null}
          </div>

          {scrollTo ? <HeroScrollLink href={scrollTo.href} label={scrollTo.label} /> : null}
        </div>
      </div>
    </section>
  );
}
