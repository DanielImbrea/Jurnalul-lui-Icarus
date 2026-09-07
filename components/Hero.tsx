import Link from "next/link";
import HeroBackground from "./HeroBackground";
import { HeroBookLeft, HeroBookRight, HeroBooksMobile } from "./HeroVisual";
import { CrowPerchedButton } from "./CrowArt";
import { TIKTOK_URL } from "@/lib/brand";

type UniverseLink = {
  href: string;
  label: string;
  hint: string;
  subtitle?: string;
  external?: boolean;
};

const universeLinks: UniverseLink[] = [
  {
    href: "/carti/sub-umbrele-lui-blake",
    label: "Sub umbrele lui Blake",
    hint: "Dark romance",
    subtitle: "Publicată în 2024 la Editura Sedcom Libris"
  },
  {
    href: "/carti/imbratisarea-durerii-si-avantajele-ei",
    label: "Îmbrățișarea durerii și avantajele ei",
    hint: "Reflecție"
  },
  {
    href: TIKTOK_URL,
    label: "Comunitatea de pe TikTok",
    hint: "Jurnalul lui Icarus",
    external: true
  }
];

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden border-b border-bone/10">
      <HeroBackground />

      <div className="container-editorial relative z-10 pb-16 pt-[5.25rem] md:pb-20 md:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(300px,1.25fr)_minmax(0,500px)_minmax(300px,1.25fr)] lg:gap-x-6 xl:gap-x-10">
          <HeroBookLeft />

          <div className="mx-auto w-full max-w-[500px] text-center">
            <p
              className="reveal-on-load font-sans text-[12px] uppercase tracking-[0.2em] text-ember"
              style={{ animationDelay: "0.05s" }}
            >
              Jurnalul lui Icarus
            </p>

            <h1
              className="reveal-on-load mt-6 text-balance font-serif text-[2.75rem] font-medium leading-[1.05] text-bone sm:text-6xl lg:text-[3.75rem]"
              style={{ animationDelay: "0.1s" }}
            >
              Unele povești
              <br />
              <span className="italic text-mist">nu se citesc.</span>
              <br />
              Se simt.
            </h1>

            <p
              className="reveal-on-load mx-auto mt-7 max-w-md font-sans text-base leading-relaxed text-mist/90"
              style={{ animationDelay: "0.22s" }}
            >
              Două cărți despre iubire, întuneric și tot ce rămâne după ele.
              Peste 200 de povești au ajuns deja în mâinile cititorilor.
            </p>

            <HeroBooksMobile className="mt-10" />

            <div
              className="reveal-on-load mt-10 flex flex-wrap items-center justify-center gap-3"
              style={{ animationDelay: "0.34s" }}
            >
              <div className="relative inline-block">
                <CrowPerchedButton className="pointer-events-none absolute bottom-full left-1/2 mb-1 h-9 w-9 -translate-x-1/2 sm:h-10 sm:w-10" />
                <Link href="/carti" className="btn-primary !px-5 !py-2.5 !text-[12px]">
                  Descoperă cărțile
                </Link>
              </div>
              <Link
                href="/galeria-cititorilor"
                className="btn-secondary !px-5 !py-2.5 !text-[12px]"
              >
                Cititorii lui Icarus
              </Link>
            </div>

            <nav
              className="reveal-on-load mx-auto mt-12 max-w-md border-t border-bone/15 pt-8 text-left"
              style={{ animationDelay: "0.42s" }}
              aria-label="În univers"
            >
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-ember">
                În univers
              </p>
              <ul className="mt-5 space-y-4">
                {universeLinks.map((item) => (
                  <li key={item.href}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group block border-b border-bone/10 pb-4 transition-colors hover:border-ember/30"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="min-w-0 font-serif text-lg leading-snug text-bone transition-colors group-hover:text-ember">
                            {item.label}
                          </span>
                          <span className="hidden shrink-0 font-sans text-[10px] uppercase tracking-wide text-ash transition-colors group-hover:text-mist sm:inline">
                            {item.hint} →
                          </span>
                        </div>
                        {item.subtitle ? (
                          <p className="mt-1 font-sans text-[11px] leading-relaxed text-ash/80">
                            {item.subtitle}
                          </p>
                        ) : null}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="group block border-b border-bone/10 pb-4 transition-colors hover:border-ember/30"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="min-w-0 font-serif text-lg leading-snug text-bone transition-colors group-hover:text-ember">
                            {item.label}
                          </span>
                          <span className="hidden shrink-0 font-sans text-[10px] uppercase tracking-wide text-ash transition-colors group-hover:text-mist sm:inline">
                            {item.hint} →
                          </span>
                        </div>
                        {item.subtitle ? (
                          <p className="mt-1 font-sans text-[11px] leading-relaxed text-ash/80">
                            {item.subtitle}
                          </p>
                        ) : null}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <HeroBookRight />
        </div>
      </div>
    </section>
  );
}
