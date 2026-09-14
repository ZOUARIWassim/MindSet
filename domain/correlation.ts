import type { LocalDate } from "./timezone";

export interface MetricPoint {
  date: LocalDate;
  value: number;
}

export interface CorrelationResult {
  coefficient: number;
  n: number;
  method: "pearson";
}

/**
 * Pearson correlation between two daily metric series, matched by date.
 * Returns a zero coefficient (not NaN) when there are fewer than 2
 * overlapping points or either series has zero variance.
 */
export function metricCorrelation(
  seriesA: MetricPoint[],
  seriesB: MetricPoint[],
  opts?: { method?: "pearson" },
): CorrelationResult {
  const method = opts?.method ?? "pearson";
  const byDateB = new Map(seriesB.map((point) => [point.date, point.value]));
  const pairs: Array<[number, number]> = [];
  for (const a of seriesA) {
    const b = byDateB.get(a.date);
    if (b !== undefined) pairs.push([a.value, b]);
  }

  const n = pairs.length;
  if (n < 2) return { coefficient: 0, n, method };

  const meanX = pairs.reduce((sum, [x]) => sum + x, 0) / n;
  const meanY = pairs.reduce((sum, [, y]) => sum + y, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;
  for (const [x, y] of pairs) {
    numerator += (x - meanX) * (y - meanY);
    denomX += (x - meanX) ** 2;
    denomY += (y - meanY) ** 2;
  }

  const denominator = Math.sqrt(denomX * denomY);
  return { coefficient: denominator === 0 ? 0 : numerator / denominator, n, method };
}
