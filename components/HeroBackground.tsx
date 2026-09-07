"use client";

import GoldenDust from "./GoldenDust";
import GoldenSmoke from "./GoldenSmoke";
import GoldenShootingStars from "./GoldenShootingStars";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="wine-gradient-base absolute inset-0" />
      <div className="wine-gradient-glow absolute inset-0" />
      <div className="grain-overlay bg-grain absolute inset-0 bg-repeat opacity-[0.05]" style={{ backgroundSize: "180px 180px" }} />
      <GoldenSmoke wisps={10} />
      <GoldenDust density="medium" />
      <GoldenShootingStars count={2} />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink via-ink/85 to-transparent" />
    </div>
  );
}
