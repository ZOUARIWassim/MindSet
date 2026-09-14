import { describe, expect, it } from "vitest";
import { bucketForTime, dueHabits, matchesFrequencyDay, type DueHabitInput } from "./scheduling";

function habit(overrides: Partial<DueHabitInput> & { id: string }): DueHabitInput {
  return {
    frequency: { type: "daily" },
    status: "active",
    archivedAt: null,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}

describe("matchesFrequencyDay", () => {
  it("daily matches every weekday", () => {
    for (let weekday = 0; weekday < 7; weekday++) {
      expect(matchesFrequencyDay({ type: "daily" }, weekday)).toBe(true);
    }
  });

  it("weekdays matches only the listed days", () => {
    const rule = { type: "weekdays" as const, days: [1, 3, 5] };
    expect(matchesFrequencyDay(rule, 1)).toBe(true);
    expect(matchesFrequencyDay(rule, 2)).toBe(false);
  });

  it("n_per_week is due every day (satisfaction is tracked separately)", () => {
    expect(matchesFrequencyDay({ type: "n_per_week", n: 3 }, 0)).toBe(true);
  });
});

describe("dueHabits", () => {
  it("excludes paused, completed, and abandoned habits", () => {
    const habits = [
      habit({ id: "active" }),
      habit({ id: "paused", status: "paused" }),
      habit({ id: "completed", status: "completed" }),
      habit({ id: "abandoned", status: "abandoned" }),
    ];
    const due = dueHabits(habits, "2026-03-01", "UTC");
    expect(due.map((h) => h.id)).toEqual(["active"]);
  });

  it("excludes a habit before its createdAt local date", () => {
    const habits = [habit({ id: "new", createdAt: new Date("2026-03-05T00:00:00Z") })];
    expect(dueHabits(habits, "2026-03-04", "UTC")).toHaveLength(0);
    expect(dueHabits(habits, "2026-03-05", "UTC")).toHaveLength(1);
  });

  it("excludes a habit on and after its archivedAt local date", () => {
    const habits = [habit({ id: "gone", archivedAt: new Date("2026-03-10T00:00:00Z") })];
    expect(dueHabits(habits, "2026-03-09", "UTC")).toHaveLength(1);
    expect(dueHabits(habits, "2026-03-10", "UTC")).toHaveLength(0);
  });

  it("respects specific-weekday frequency", () => {
    const habits = [habit({ id: "mwf", frequency: { type: "weekdays", days: [1, 3, 5] } })];
    // 2026-03-02 is a Monday
    expect(dueHabits(habits, "2026-03-02", "UTC")).toHaveLength(1);
    // 2026-03-03 is a Tuesday
    expect(dueHabits(habits, "2026-03-03", "UTC")).toHaveLength(0);
  });

  it("marks an n_per_week habit satisfiedThisWeek once its weekly count is met, but keeps it due", () => {
    const habits = [habit({ id: "gym", frequency: { type: "n_per_week", n: 3 } })];
    const [notYet] = dueHabits(habits, "2026-03-02", "UTC", new Map([["gym", 2]]));
    expect(notYet.satisfiedThisWeek).toBe(false);

    const [met] = dueHabits(habits, "2026-03-02", "UTC", new Map([["gym", 3]]));
    expect(met.satisfiedThisWeek).toBe(true);
  });

  it("is timezone-sensitive at day boundaries", () => {
    // 2026-03-05T02:00:00Z is still 2026-03-04 in America/New_York (UTC-5)
    const habits = [habit({ id: "h", createdAt: new Date("2026-03-05T02:00:00Z") })];
    expect(dueHabits(habits, "2026-03-04", "America/New_York")).toHaveLength(1);
    expect(dueHabits(habits, "2026-03-04", "UTC")).toHaveLength(0);
  });

  it("handles a DST spring-forward boundary without shifting due dates", () => {
    // US DST starts 2026-03-08. A habit created just before it should still
    // be due exactly on and after its local creation date either side of
    // the transition.
    const habits = [habit({ id: "h", createdAt: new Date("2026-03-08T06:00:00Z") })];
    expect(dueHabits(habits, "2026-03-08", "America/New_York")).toHaveLength(1);
    expect(dueHabits(habits, "2026-03-09", "America/New_York")).toHaveLength(1);
  });
});

describe("bucketForTime", () => {
  it("buckets hours into the expected parts of day", () => {
    expect(bucketForTime("06:00")).toBe("early_morning");
    expect(bucketForTime("08:00")).toBe("morning");
    expect(bucketForTime("13:30")).toBe("afternoon");
    expect(bucketForTime("18:00")).toBe("evening");
    expect(bucketForTime("22:00")).toBe("night");
    expect(bucketForTime("02:00")).toBe("night");
  });
});
