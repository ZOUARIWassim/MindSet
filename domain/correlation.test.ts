import { describe, expect, it } from "vitest";
import { metricCorrelation } from "./correlation";

describe("metricCorrelation", () => {
  it("finds a perfect positive correlation", () => {
    const a = [1, 2, 3, 4, 5].map((v, i) => ({ date: `2026-03-0${i + 1}`, value: v }));
    const b = [2, 4, 6, 8, 10].map((v, i) => ({ date: `2026-03-0${i + 1}`, value: v }));
    const result = metricCorrelation(a, b);
    expect(result.coefficient).toBeCloseTo(1);
    expect(result.n).toBe(5);
  });

  it("finds a perfect negative correlation", () => {
    const a = [1, 2, 3, 4, 5].map((v, i) => ({ date: `2026-03-0${i + 1}`, value: v }));
    const b = [5, 4, 3, 2, 1].map((v, i) => ({ date: `2026-03-0${i + 1}`, value: v }));
    expect(metricCorrelation(a, b).coefficient).toBeCloseTo(-1);
  });

  it("only pairs points that share a date", () => {
    const a = [
      { date: "2026-03-01", value: 1 },
      { date: "2026-03-02", value: 2 },
      { date: "2026-03-03", value: 3 },
    ];
    const b = [
      { date: "2026-03-01", value: 10 },
      { date: "2026-03-03", value: 30 },
    ];
    expect(metricCorrelation(a, b).n).toBe(2);
  });

  it("returns a zero coefficient when there are fewer than 2 overlapping points", () => {
    const a = [{ date: "2026-03-01", value: 1 }];
    const b = [{ date: "2026-03-01", value: 2 }];
    const result = metricCorrelation(a, b);
    expect(result.coefficient).toBe(0);
    expect(result.n).toBe(1);
  });

  it("returns a zero coefficient when a series has no variance", () => {
    const a = [1, 2, 3].map((v, i) => ({ date: `2026-03-0${i + 1}`, value: v }));
    const b = [5, 5, 5].map((v, i) => ({ date: `2026-03-0${i + 1}`, value: v }));
    expect(metricCorrelation(a, b).coefficient).toBe(0);
  });
});
