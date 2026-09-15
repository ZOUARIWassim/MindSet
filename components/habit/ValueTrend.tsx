function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function ValueTrend({
  points,
  unit,
}: {
  points: Array<{ date: string; value: number }>;
  unit: string;
}) {
  if (points.length < 2) {
    return <p className="text-sm text-text-muted">Not enough logged values yet to show a trend.</p>;
  }

  const width = 320;
  const height = 64;
  const padding = 6;
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const toXY = (point: { value: number }, index: number) => {
    const x = (index / (points.length - 1)) * width;
    const y = padding + (1 - (point.value - min) / range) * (height - padding * 2);
    return { x, y };
  };

  const coords = points.map(toXY);
  const linePoints = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const areaPoints = `0,${height} ${linePoints} ${width},${height}`;

  return (
    <div className="flex flex-col gap-1.5">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-16 w-full text-accent">
        <defs>
          <linearGradient id="value-trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.18} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((fraction) => (
          <line
            key={fraction}
            x1={0}
            x2={width}
            y1={height * fraction}
            y2={height * fraction}
            className="stroke-border"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        ))}
        <polygon points={areaPoints} fill="url(#value-trend-fill)" stroke="none" />
        <polyline points={linePoints} fill="none" stroke="currentColor" strokeWidth={2} />
        {coords.map((c, index) => (
          <circle key={index} cx={c.x} cy={c.y} r={2.5} fill="currentColor" />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-text-muted">
        <span>{formatDate(points[0].date)}</span>
        <span>
          {min}-{max} {unit}
        </span>
        <span>{formatDate(points[points.length - 1].date)}</span>
      </div>
    </div>
  );
}
