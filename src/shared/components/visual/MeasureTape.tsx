interface MeasureTapeProps {
  label?: string;
  className?: string;
}

const TICKS: { x: number; major: boolean }[] = [];
for (let x = 0; x <= 1200; x += 40) {
  TICKS.push({ x, major: x % 200 === 0 });
}

/**
 * La cinta del aserradero: una regla industrial con marcas de medición y el
 * despiece del tablón en tinta mono. Geometría vectorial, sin fotografía.
 */
export function MeasureTape({ label = '2" x 8" x 10\'', className }: MeasureTapeProps) {
  return (
    <svg
      viewBox="0 0 1200 72"
      preserveAspectRatio="none"
      role="img"
      aria-label={`Despiece del tablón: ${label}`}
      className={className}
    >
      <rect x="0" y="0" width="1200" height="72" fill="#26261f" />
      {TICKS.map((t) => (
        <line
          key={t.x}
          x1={t.x}
          y1={t.major ? 14 : 24}
          x2={t.x}
          y2={t.major ? 72 : 52}
          stroke={t.major ? "#e05e16" : "#c8b794"}
          strokeWidth={t.major ? 3 : 2}
        />
      ))}
      {[0, 200, 400, 600, 800, 1000].map((x) => (
        <text
          key={x}
          x={x + 6}
          y={32}
          fontFamily="var(--font-mono), monospace"
          fontSize="17"
          fill="#f4ead6"
        >
          {x}
        </text>
      ))}
      <rect x="0" y="40" width="1200" height="2" fill="#c8b794" opacity="0.5" />
      <g>
        <rect x="830" y="16" width="370" height="40" fill="#e05e16" />
        <text
          x="848"
          y="42"
          fontFamily="var(--font-stencil), var(--font-display), sans-serif"
          fontSize="28"
          fontWeight="700"
          fill="#2a1603"
        >
          DESPIECE {label}
        </text>
      </g>
    </svg>
  );
}
