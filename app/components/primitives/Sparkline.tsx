/**
 * Sparkline — minimal SVG line chart for trend strips.
 *
 * Designed for inline use next to a metric. Animates the stroke draw on
 * mount and renders an optional area fill, end dot, and gridless context.
 * Uses currentColor so callers control the hue via Tailwind text utilities.
 */
type Props = {
  values: number[];
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  strokeWidth?: number;
};

export function Sparkline({
  values,
  width = 120,
  height = 36,
  fill = true,
  className = "text-ink",
  strokeWidth = 1.5
}: Props) {
  if (!values.length) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = values.length > 1 ? width / (values.length - 1) : width;

  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => (i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : `L ${x.toFixed(2)} ${y.toFixed(2)}`))
    .join(" ");
  const areaPath = `${linePath} L ${width.toFixed(2)} ${height} L 0 ${height} Z`;
  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-hidden
    >
      {fill && (
        <path
          d={areaPath}
          fill="currentColor"
          fillOpacity={0.08}
        />
      )}
      <path
        d={linePath}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw-line"
        strokeDasharray="1000"
        strokeDashoffset="1000"
      />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill="currentColor" />
      <circle cx={last[0]} cy={last[1]} r={5} fill="currentColor" fillOpacity={0.18} />
    </svg>
  );
}
