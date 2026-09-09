import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME, LOGO_SRC } from "@/lib/brand";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export default function Logo({ className = "", compact = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={`group inline-flex shrink-0 flex-nowrap items-center gap-3 ${className}`}
      aria-label={BRAND_NAME}
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-[1.04]">
        <Image
          src={LOGO_SRC}
          alt=""
          width={88}
          height={88}
          className="h-full w-full object-cover"
          priority
        />
      </span>

      {!compact && (
        <span className="shrink-0 whitespace-nowrap font-serif text-[13px] leading-none text-bone lg:text-[15px]">
          Jurnalul lui Icarus
        </span>
      )}
    </Link>
  );
}
