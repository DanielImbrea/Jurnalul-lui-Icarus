type IcarusLogoMarkProps = {
  className?: string;
  variant?: "full" | "mark";
};

export default function IcarusLogoMark({
  className = "",
  variant = "mark"
}: IcarusLogoMarkProps) {
  if (variant === "full") {
    return (
      <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden>
        <circle cx="60" cy="60" r="58" fill="#F6F3EC" />
        <g transform="translate(60 56) scale(1.05)">
          <MarkGraphic />
        </g>
        <text
          x="60"
          y="98"
          textAnchor="middle"
          fill="#0E0D0C"
          fontFamily="Georgia, serif"
          fontSize="5"
          letterSpacing="2"
        >
          JURNALUL LUI ICARUS
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      <circle cx="50" cy="50" r="48" fill="#F6F3EC" />
      <g transform="translate(50 50)">
        <MarkGraphic />
      </g>
    </svg>
  );
}

/** Grafic simplificat — lizibil la 48px */
function MarkGraphic() {
  return (
    <>
      {/* J + undă */}
      <path
        d="M-22 -28c0-10 7-18 18-19 6-1 11 2 14 6-7 2-12 7-12 16 0 5 2 9 6 12"
        stroke="#0E0D0C"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M-14 -10c8-2 18-1 26 4 5 3 8 7 8 12"
        stroke="#0E0D0C"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />

      <Bird x={-6} y={-4} scale={1.05} />
      <Bird x={14} y={-8} scale={0.82} flip />

      {/* Carte deschisă — mai mare, centrată jos */}
      <g transform="translate(0 22)">
        <path d="M-14 0c-5-2-10-2-15 0v12c5-2 10-2 15 0V0z" fill="#0E0D0C" />
        <path d="M0 0c5-2 10-2 15 0v12c-5-2-10-2-15 0V0z" fill="#0E0D0C" />
        <line x1="0" y1="0" x2="0" y2="12" stroke="#F6F3EC" strokeWidth="0.8" />
      </g>
    </>
  );
}

function Bird({
  x,
  y,
  scale = 1,
  flip = false
}: {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
}) {
  const sx = flip ? -scale : scale;
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${scale})`}>
      <path
        fill="#0E0D0C"
        d="M-10 3c3-4 9-6 14-4 2-2 6-3 10-2 2-1 5-0.5 7 1.5-3 1-6 2.5-7 4.5 4 1 7 3.5 8 6.5-5 1-10 0-14-2.5-4 2.5-9 3.5-13 2.5-2 1-4.5 1-6.5 0 1.5-2 3-3.5 4.5-5 1-2 2-3 3-4.5z"
      />
      <circle cx="5" cy="0" r="1.1" fill="#8b1a2a" />
      <circle cx="5" cy="0" r="0.45" fill="#e02545" />
    </g>
  );
}
