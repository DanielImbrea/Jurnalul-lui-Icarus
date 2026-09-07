"use client";

import { useMemo, type CSSProperties } from "react";

interface GoldenShootingStarsProps {
  count?: number;
  className?: string;
  intro?: boolean;
}

type StarPath = "ltr" | "ttb" | "diag-se" | "diag-sw";

const INTRO_TRAVEL = { x: 78, y: 24 };

function pickPath(): StarPath {
  const paths: StarPath[] = ["ltr", "diag-se", "ttb", "diag-se", "diag-sw", "ltr", "ttb"];
  return paths[Math.floor(Math.random() * paths.length)];
}

function travelAngle(travelX: number, travelY: number) {
  return (Math.atan2(travelY, travelX) * 180) / Math.PI;
}

function pathConfig(path: StarPath) {
  let travelX = 0;
  let travelY = 0;
  let left = "0%";
  let top = "0%";

  switch (path) {
    case "ltr":
      left = `${-5 + Math.random() * 40}%`;
      top = `${8 + Math.random() * 78}%`;
      travelX = 95 + Math.random() * 25;
      travelY = -1.5 + Math.random() * 3;
      break;
    case "ttb":
      left = `${12 + Math.random() * 76}%`;
      top = `${-2 + Math.random() * 18}%`;
      travelX = -1.5 + Math.random() * 3;
      travelY = 55 + Math.random() * 35;
      break;
    case "diag-se":
      left = `${-4 + Math.random() * 38}%`;
      top = `${-2 + Math.random() * 28}%`;
      travelX = 80 + Math.random() * 30;
      travelY = 28 + Math.random() * 28;
      break;
    case "diag-sw":
      left = `${58 + Math.random() * 35}%`;
      top = `${-2 + Math.random() * 22}%`;
      travelX = -(55 + Math.random() * 25);
      travelY = 26 + Math.random() * 26;
      break;
  }

  return {
    left,
    top,
    endX: `${travelX}vw`,
    endY: `${travelY}vh`,
    angle: travelAngle(travelX, travelY),
    dotSize: 2.5 + Math.random() * 2.5,
    tailLength: 8 + Math.random() * 14,
    peakOpacity: 0.45 + Math.random() * 0.4
  };
}

function createShootingStars(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const cfg = pathConfig(pickPath());
    const cycle = 14 + Math.random() * 10;

    return {
      id: i,
      ...cfg,
      cycle,
      delay: `${-(i * (cycle / count) + Math.random() * 3.5)}s`
    };
  });
}

function ShootingDot({
  left,
  top,
  angle,
  endX,
  endY,
  dotSize,
  tailLength,
  peakOpacity,
  animationDuration,
  animationDelay,
  intro = false
}: {
  left: string;
  top: string;
  angle: number;
  endX: string;
  endY: string;
  dotSize: number;
  tailLength: number;
  peakOpacity: number;
  animationDuration?: string;
  animationDelay?: string;
  intro?: boolean;
}) {
  const style = {
    left,
    top,
    "--star-angle": `${angle}deg`,
    "--end-x": endX,
    "--end-y": endY,
    "--star-peak": peakOpacity,
    "--dot-size": `${dotSize}px`,
    "--tail-length": `${tailLength}px`,
    ...(intro || !animationDuration
      ? {}
      : {
          animationDuration,
          ...(animationDelay ? { animationDelay } : {})
        })
  } as CSSProperties;

  return (
    <span
      className={`golden-shooting-dot absolute${intro ? " golden-shooting-intro" : ""}`}
      style={style}
    >
      <span className="golden-shooting-tail" />
      <span className="golden-shooting-core" />
    </span>
  );
}

export default function GoldenShootingStars({
  count = 4,
  className = "",
  intro = false
}: GoldenShootingStarsProps) {
  const stars = useMemo(() => createShootingStars(count), [count]);
  const introAngle = travelAngle(INTRO_TRAVEL.x, INTRO_TRAVEL.y);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {intro ? (
        <ShootingDot
          intro
          left="16%"
          top="12%"
          angle={introAngle}
          endX={`${INTRO_TRAVEL.x}vw`}
          endY={`${INTRO_TRAVEL.y}vh`}
          dotSize={3.5}
          tailLength={14}
          peakOpacity={0.7}
        />
      ) : null}

      {stars.map((star) => (
        <ShootingDot
          key={star.id}
          left={star.left}
          top={star.top}
          angle={star.angle}
          endX={star.endX}
          endY={star.endY}
          dotSize={star.dotSize}
          tailLength={star.tailLength}
          peakOpacity={star.peakOpacity}
          animationDuration={`${star.cycle}s`}
          animationDelay={star.delay}
        />
      ))}
    </div>
  );
}
