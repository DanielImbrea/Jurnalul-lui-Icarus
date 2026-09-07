import Link from "next/link";
import IcarusLogoMark from "./IcarusLogoMark";
import IcarusLogoMarkDual from "./IcarusLogoMarkDual";
import { BRAND_NAME } from "@/lib/brand";

interface LogoProps {
  className?: string;
  compact?: boolean;
  /** Logo vechi cu fundal crem — implicit: noul mark dual transparent */
  legacy?: boolean;
}

export default function Logo({
  className = "",
  compact = false,
  legacy = false
}: LogoProps) {
  if (legacy) {
    return (
      <Link
        href="/"
        className={`group inline-flex shrink-0 flex-nowrap items-center gap-2.5 ${className}`}
        aria-label={BRAND_NAME}
      >
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-bone/20 shadow-lg shadow-black/35 transition-all duration-300 group-hover:border-ember/45">
          <IcarusLogoMark className="h-full w-full" variant="mark" />
        </span>
        {!compact && (
          <span className="shrink-0 whitespace-nowrap font-serif text-[13px] leading-none text-bone lg:text-[15px]">
            Jurnalul lui Icarus
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`group inline-flex shrink-0 flex-nowrap items-center gap-3 ${className}`}
      aria-label={BRAND_NAME}
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-[1.04]">
        <IcarusLogoMarkDual className="h-full w-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]" />
      </span>

      {!compact && (
        <span className="shrink-0 whitespace-nowrap font-serif text-[13px] leading-none text-bone lg:text-[15px]">
          Jurnalul lui Icarus
        </span>
      )}
    </Link>
  );
}
