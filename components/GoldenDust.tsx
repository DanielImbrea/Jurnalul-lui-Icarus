"use client";

import { useMemo } from "react";

interface GoldenDustProps {
  density?: "light" | "medium" | "rich";
  className?: string;
}

function createDust(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 2.2,
    delay: `${Math.random() * 14}s`,
    driftDuration: `${18 + Math.random() * 22}s`,
    twinkleDuration: `${3 + Math.random() * 4}s`,
    opacity: 0.2 + Math.random() * 0.5,
    driftX: `${-28 + Math.random() * 56}px`,
    driftY: `${-90 - Math.random() * 70}px`,
    isStar: Math.random() > 0.82,
    starSize: 5 + Math.random() * 7
  }));
}

const densityMap = {
  light: 24,
  medium: 40,
  rich: 54
};

export default function GoldenDust({
  density = "medium",
  className = ""
}: GoldenDustProps) {
  const particles = useMemo(() => createDust(densityMap[density]), [density]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {particles.map((p) =>
        p.isStar ? (
          <span
            key={p.id}
            className="golden-star absolute"
            style={{
              left: p.left,
              top: p.top,
              width: p.starSize,
              height: p.starSize,
              ["--dust-peak" as string]: p.opacity,
              ["--drift-x" as string]: p.driftX,
              ["--drift-y" as string]: p.driftY,
              animationDelay: p.delay,
              animationDuration: `${p.driftDuration}, ${p.twinkleDuration}`
            }}
          />
        ) : (
          <span
            key={p.id}
            className="golden-dust absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              ["--dust-peak" as string]: p.opacity,
              ["--drift-x" as string]: p.driftX,
              ["--drift-y" as string]: p.driftY,
              animationDelay: p.delay,
              animationDuration: `${p.driftDuration}, ${p.twinkleDuration}`
            }}
          />
        )
      )}
    </div>
  );
}
