import { describe, expect, it } from "vitest";
import {
  completionRate,
  dailyOutcomes,
  rateByTimeOfDay,
  rateByWeekday,
  systemHealth,
  type HabitEntryLike,
} from "./completion";
import type { DueHabitInput } from "./scheduling";

function habit(overrides: Partial<DueHabitInput> & { id: string }): DueHabitInput {
  return {
    frequency: { type: "daily" },
    status: "active",
    archivedAt: null,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}

function entry(
  checkInDate: string,
  status: HabitEntryLike["status"],
  performedAt: Date | null = null,
): HabitEntryLike {
  return { checkInDate, status, performedAt };
}

describe("completionRate", () => {
  it("counts completed and minimum as full success", () => {
    const h = habit({ id: "h" });
    const entries = [
      entry("2026-03-01", "completed"),
      entry("2026-03-02", "minimum"),
    ];
    const result = completionRate(h, entries, { start: "2026-03-01", end: "2026-03-02" }, "UTC");
    expect(result.rate).toBe(1);
    expect(result.eligibleDays).toBe(2);
  });

  it("weights partial entries and treats missing entries as missed", () => {
    const h = habit({ id: "h" });
    const entries = [entry("2026-03-01", "partial")];
    const result = completionRate(h, entries, { start: "2026-03-01", end: "2026-03-02" }, "UTC");
    // day 1: partial (0.5), day 2: no entry -> missed (0). rate = 0.25
    expect(result.rate).toBeCloseTo(0.25);
    expect(result.missedCount).toBe(1);
  });

  it("excludes skipped_intentionally from the denominator entirely", () => {
    const h = habit({ id: "h" });
    const entries = [entry("2026-03-01", "completed"), entry("2026-03-02", "skipped_intentionally")];
    const result = completionRate(h, entries, { start: "2026-03-01", end: "2026-03-02" }, "UTC");
    expect(result.eligibleDays).toBe(1);
    expect(result.rate).toBe(1);
  });

  it("excludes days before the habit was created", () => {
    const h = habit({ id: "h", createdAt: new Date("2026-03-02T00:00:00Z") });
    const entries = [entry("2026-03-01", "completed")]; // logged before creation shouldn't happen, but window should still exclude it
    const result = completionRate(h, entries, { start: "2026-03-01", end: "2026-03-02" }, "UTC");
    expect(result.eligibleDays).toBe(1); // only 2026-03-02 is in scope
  });

  it("computes a paused habit's historical rate the same as an active one (paused only affects scheduling)", () => {
    const h = habit({ id: "h", status: "paused" });
    const entries = [entry("2026-03-01", "completed")];
    const result = completionRate(h, entries, { start: "2026-03-01", end: "2026-03-01" }, "UTC");
    expect(result.rate).toBe(1);
  });

  it("measures n_per_week habits by week, not by day", () => {
    const h = habit({ id: "gym", frequency: { type: "n_per_week", n: 3 } });
    // Week of 2026-03-01 (Sunday) through 2026-03-07 (Saturday): 3 completions -> fully met
    const entries = [
      entry("2026-03-02", "completed"),
      entry("2026-03-04", "completed"),
      entry("2026-03-06", "completed"),
    ];
    const result = completionRate(h, entries, { start: "2026-03-01", end: "2026-03-07" }, "UTC");
    expect(result.eligibleDays).toBe(1); // one week
    expect(result.rate).toBe(1);
  });

  it("caps an n_per_week week's contribution at 1 even when the target is exceeded", () => {
    const h = habit({ id: "gym", frequency: { type: "n_per_week", n: 2 } });
    const entries = [
      entry("2026-03-02", "completed"),
      entry("2026-03-03", "completed"),
      entry("2026-03-04", "completed"),
      entry("2026-03-05", "completed"),
    ];
    const result = completionRate(h, entries, { start: "2026-03-01", end: "2026-03-07" }, "UTC");
    expect(result.rate).toBe(1);
  });

  it("gives partial credit for a partially-met n_per_week week", () => {
    const h = habit({ id: "gym", frequency: { type: "n_per_week", n: 4 } });
    const entries = [entry("2026-03-02", "completed"), entry("2026-03-04", "completed")];
    const result = completionRate(h, entries, { start: "2026-03-01", end: "2026-03-07" }, "UTC");
    expect(result.rate).toBe(0.5);
  });
});

describe("rateByWeekday", () => {
  it("buckets by local weekday and reports sample size", () => {
    const h = habit({ id: "h" });
    // 2026-03-02 is a Monday, 2026-03-09 is the next Monday
    const entries = [entry("2026-03-02", "completed"), entry("2026-03-09", "missed")];
    const rates = rateByWeekday(h, entries, { start: "2026-03-02", end: "2026-03-09" }, "UTC");
    const monday = rates.find((r) => r.weekday === 1)!;
    expect(monday.sampleSize).toBe(2);
    expect(monday.rate).toBe(0.5);
  });

  it("excludes intentional skips from the weekday sample", () => {
    const h = habit({ id: "h" });
    const entries = [entry("2026-03-02", "skipped_intentionally")];
    const rates = rateByWeekday(h, entries, { start: "2026-03-02", end: "2026-03-02" }, "UTC");
    const monday = rates.find((r) => r.weekday === 1)!;
    expect(monday.sampleSize).toBe(0);
  });
});

describe("rateByTimeOfDay", () => {
  it("buckets by performedAt when present", () => {
    const h = habit({ id: "h" });
    const entries = [
      entry("2026-03-01", "completed", new Date("2026-03-01T08:15:00Z")),
      entry("2026-03-02", "missed"),
    ];
    const rates = rateByTimeOfDay(
      { ...h, preferredTime: "22:00" },
      entries,
      { start: "2026-03-01", end: "2026-03-02" },
      "UTC",
    );
    const morning = rates.find((r) => r.bucket === "morning")!;
    const night = rates.find((r) => r.bucket === "night")!;
    expect(morning.sampleSize).toBe(1);
    expect(morning.rate).toBe(1);
    // the missed day has no performedAt, so it falls back to the habit's preferredTime bucket
    expect(night.sampleSize).toBe(1);
    expect(night.rate).toBe(0);
  });

  it("demonstrates a habit succeeding in the morning and failing at night", () => {
    const h = habit({ id: "h" });
    const entries = [
      entry("2026-03-01", "completed", new Date("2026-03-01T08:00:00Z")),
      entry("2026-03-02", "completed", new Date("2026-03-02T08:10:00Z")),
      entry("2026-03-03", "missed", null),
      entry("2026-03-04", "missed", null),
    ];
    const rates = rateByTimeOfDay(
      { ...h, preferredTime: "22:00" },
      entries,
      { start: "2026-03-01", end: "2026-03-04" },
      "UTC",
    );
    expect(rates.find((r) => r.bucket === "morning")!.rate).toBe(1);
    expect(rates.find((r) => r.bucket === "night")!.rate).toBe(0);
  });
});

describe("systemHealth", () => {
  it("averages per-habit completion rate and flags a declining trend", () => {
    const habitA = habit({ id: "a", createdAt: new Date("2026-01-01T00:00:00Z") });
    const entriesByHabit = new Map<string, HabitEntryLike[]>([
      [
        "a",
        [
          // previous window (2026-02-21..2026-02-22): all completed
          entry("2026-02-21", "completed"),
          entry("2026-02-22", "completed"),
          // current window (2026-02-23..2026-02-24): all missed
        ],
      ],
    ]);
    const result = systemHealth(
      { id: "sys" },
      [habitA],
      entriesByHabit,
      { start: "2026-02-23", end: "2026-02-24" },
      "UTC",
    );
    expect(result.trend).toBe("declining");
    expect(result.rate).toBe(0);
  });
});

describe("dailyOutcomes", () => {
  it("marks an unlogged due day as null status rather than a failure signal", () => {
    const h = habit({ id: "h" });
    const entries = [entry("2026-03-01", "completed")];
    const outcomes = dailyOutcomes(h, entries, { start: "2026-03-01", end: "2026-03-02" }, "UTC");
    expect(outcomes).toEqual([
      { date: "2026-03-01", status: "completed" },
      { date: "2026-03-02", status: null },
    ]);
  });

  it("treats every day as due for an n_per_week habit", () => {
    const h = habit({ id: "h", frequency: { type: "n_per_week", n: 3 } });
    const outcomes = dailyOutcomes(h, [], { start: "2026-03-01", end: "2026-03-03" }, "UTC");
    expect(outcomes).toHaveLength(3);
  });
});
