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
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const coords = points.map((point, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - ((point.value - min) / range) * height;
    return `${x},${y}`;
  });

  return (
    <div className="flex flex-col gap-1">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-16 w-full text-accent">
        <polyline points={coords.join(" ")} fill="none" stroke="currentColor" strokeWidth={2} />
      </svg>
      <div className="flex justify-between text-xs text-text-muted">
        <span>
          {min} {unit}
        </span>
        <span>
          {max} {unit}
        </span>
      </div>
    </div>
  );
}
