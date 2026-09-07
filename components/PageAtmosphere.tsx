"use client";

import GoldenDust from "@/components/GoldenDust";
import GoldenSmoke from "@/components/GoldenSmoke";
import GoldenShootingStars from "@/components/GoldenShootingStars";

interface PageAtmosphereProps {
  className?: string;
  smoke?: number;
  dust?: "light" | "medium";
  shootingStars?: number;
  subtle?: boolean;
  fixed?: boolean;
}

export default function PageAtmosphere({
  className = "",
  smoke = 10,
  dust = "light",
  shootingStars = 2,
  subtle = true,
  fixed = false
}: PageAtmosphereProps) {
  return (
    <div
      className={`pointer-events-none overflow-hidden ${
        fixed
          ? "fixed inset-x-0 top-0 z-0 h-[100dvh] w-full max-w-[100vw]"
          : "absolute inset-0"
      } ${className}`}
      aria-hidden
    >
      <GoldenSmoke wisps={smoke} subtle={subtle} />
      <GoldenDust density={dust} />
      {shootingStars > 0 ? <GoldenShootingStars count={shootingStars} /> : null}
    </div>
  );
}
