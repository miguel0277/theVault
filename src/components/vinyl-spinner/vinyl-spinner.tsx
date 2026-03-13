"use client";

interface VinylSpinnerProps {
  size?: number;
  spinning?: boolean;
  label?: string;
  className?: string;
}

export function VinylSpinner({
  size = 120,
  spinning = false,
  label,
  className = "",
}: VinylSpinnerProps) {
  const half = size / 2;
  const grooveCount = 8;

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={spinning ? "animate-spin-vinyl" : ""}
      >
        {/* Outer edge */}
        <circle
          cx={half}
          cy={half}
          r={half - 2}
          fill="#1a1a1a"
          stroke="#2a2a2a"
          strokeWidth="2"
        />

        {/* Grooves */}
        {Array.from({ length: grooveCount }).map((_, i) => {
          const r = half * 0.35 + ((half * 0.55) / grooveCount) * i;
          return (
            <circle
              key={i}
              cx={half}
              cy={half}
              r={r}
              fill="none"
              stroke="#222"
              strokeWidth="0.5"
              opacity={0.6}
            />
          );
        })}

        {/* Label area */}
        <circle
          cx={half}
          cy={half}
          r={half * 0.3}
          fill="#c9a84c"
          opacity={0.9}
        />
        <circle
          cx={half}
          cy={half}
          r={half * 0.28}
          fill="none"
          stroke="#a88a3a"
          strokeWidth="0.5"
        />

        {/* Center hole */}
        <circle cx={half} cy={half} r={half * 0.05} fill="#1a0a0a" />

        {/* Label text */}
        {label && (
          <text
            x={half}
            y={half + 2}
            textAnchor="middle"
            fill="#1a0a0a"
            fontSize={size * 0.06}
            fontFamily="var(--font-label)"
            letterSpacing="0.15em"
          >
            {label.toUpperCase().slice(0, 12)}
          </text>
        )}
      </svg>
    </div>
  );
}
