"use client";

import { useMemo, type CSSProperties } from "react";

interface GoldenSmokeProps {
  wisps?: number;
  className?: string;
  subtle?: boolean;
}

interface SmokeBlob {
  size: number;
  heightRatio: number;
  offsetX: number;
  offsetY: number;
  blur: number;
  delay: string;
}

function createWisps(count: number, subtle: boolean) {
  return Array.from({ length: count }, (_, i) => {
    const blobCount = 2 + Math.floor(Math.random() * 2);
    const blobs: SmokeBlob[] = Array.from({ length: blobCount }, (_, j) => ({
      size: 10 + Math.random() * 22,
      heightRatio: 0.72 + Math.random() * 0.55,
      offsetX: -10 + Math.random() * 20,
      offsetY: -8 + Math.random() * 16,
      blur: 7 + Math.random() * 10,
      delay: `${j * -1.8 - Math.random() * 2}s`
    }));

    return {
      id: i,
      left: `${-5 + Math.random() * 105}%`,
      top: `${Math.random() * 100}%`,
      duration: 16 + Math.random() * 20,
      delay: `${-Math.random() * 36}s`,
      peakOpacity: subtle ? 0.38 + Math.random() * 0.22 : 0.48 + Math.random() * 0.32,
      dx1: `${-18 + Math.random() * 36}px`,
      dy1: `${-22 + Math.random() * 18}px`,
      dx2: `${8 + Math.random() * 42}px`,
      dy2: `${-12 + Math.random() * 28}px`,
      dx3: `${18 + Math.random() * 48}px`,
      dy3: `${-28 + Math.random() * 22}px`,
      rot: `${-14 + Math.random() * 28}deg`,
      blobs
    };
  });
}

export default function GoldenSmoke({
  wisps = 10,
  className = "",
  subtle = false
}: GoldenSmokeProps) {
  const items = useMemo(() => createWisps(wisps, subtle), [wisps, subtle]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {items.map((w) => (
        <div
          key={w.id}
          className="golden-smoke-cluster absolute"
          style={
            {
              left: w.left,
              top: w.top,
              animationDuration: `${w.duration}s`,
              animationDelay: w.delay,
              "--smoke-peak": w.peakOpacity,
              "--dx1": w.dx1,
              "--dy1": w.dy1,
              "--dx2": w.dx2,
              "--dy2": w.dy2,
              "--dx3": w.dx3,
              "--dy3": w.dy3,
              "--smoke-rot": w.rot
            } as CSSProperties
          }
        >
          {w.blobs.map((blob, index) => (
            <span
              key={index}
              className="golden-smoke-blob absolute"
              style={
                {
                  width: blob.size,
                  height: blob.size * blob.heightRatio,
                  left: blob.offsetX,
                  top: blob.offsetY,
                  filter: `blur(${blob.blur}px)`,
                  animationDelay: blob.delay
                } as CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
