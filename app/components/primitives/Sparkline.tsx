/**
 * Sparkline. premium SVG trend strip with gradient area fill.
 *
 * Designed for inline use next to a metric. Renders a soft gradient under
 * the line so the chart feels three-dimensional without overwhelming the
 * adjacent number. Uses currentColor for the line so callers control hue
 * via Tailwind text utilities; the gradient inherits from currentColor too.
 */
type Props = {
  values: number[];
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  strokeWidth?: number;
};

let _sparkUid = 0;

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

  // Generate a stable but unique gradient id per render so multiple
  // sparklines on the same page don't collide.
  const gid = `spark-grad-${_sparkUid++}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.32" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && (
        <path
          d={areaPath}
          fill={`url(#${gid})`}
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
      {/* Halo on the trailing point for that "live data" feel */}
      <circle cx={last[0]} cy={last[1]} r={2.6} fill="currentColor" />
      <circle cx={last[0]} cy={last[1]} r={5.5} fill="currentColor" fillOpacity={0.18} />
      <circle cx={last[0]} cy={last[1]} r={9} fill="currentColor" fillOpacity={0.06} />
    </svg>
  );
}
