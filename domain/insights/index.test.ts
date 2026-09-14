import { describe, expect, it } from "vitest";
import { generateContextCorrelationInsights } from "./contextCorrelation";
import { generateTimeOfDayInsights } from "./timeOfDay";
import { generateDecliningSystemInsights } from "./decliningSystem";
import { generateMetricCorrelationInsights } from "./metricCorrelation";
import { generateMinimumRelianceInsights } from "./minimumReliance";
import { generateInsights, daysUntilInsightsAvailable } from "./index";
import type { HabitContext, HabitSystemContext, UserContext } from "../userContext";
import type { HabitEntryLike } from "../completion";
import { addDaysLocal } from "../timezone";

function makeHabit(overrides: Partial<HabitContext> & { id: string }): HabitContext {
  return {
    name: "Habit",
    frequency: { type: "daily" },
    status: "active",
    archivedAt: null,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    preferredTime: null,
    entries: [],
    ...overrides,
  };
}

function makeSystem(id: string, habits: HabitContext[]): HabitSystemContext {
  return { id, name: `System ${id}`, habits };
}

function makeContext(overrides: Partial<UserContext>): UserContext {
  return {
    user: { id: "u1", timezone: "UTC" },
    identities: [],
    checkIns: [],
    existingInsights: [],
    referenceDate: "2026-03-31",
    ...overrides,
  };
}

function entry(checkInDate: string, status: HabitEntryLike["status"], performedAt: Date | null = null): HabitEntryLike {
  return { checkInDate, status, performedAt };
}

describe("generateContextCorrelationInsights", () => {
  it("flags a habit that reliably slips on travel days", () => {
    const dates = Array.from({ length: 20 }, (_, i) => addDaysLocal("2026-03-01", i));
    const entries = dates.map((date, i) => entry(date, i % 5 === 0 ? "missed" : "completed"));
    const habit = makeHabit({ id: "h1", name: "Morning Run", entries });
    const checkIns = dates.map((date, i) => ({
      date,
      energy: 3,
      mood: 3,
      stress: 3,
      focus: 3,
      context: i % 5 === 0 ? { travel: true } : null,
    }));

    const drafts = generateContextCorrelationInsights(
      makeContext({ identities: [{ id: "id1", name: "Athlete", systems: [makeSystem("s1", [habit])] }], checkIns }),
    );

    expect(drafts.some((d) => d.kind === "context_correlation")).toBe(true);
  });

  it("does not fire below the minimum group sample size", () => {
    const habit = makeHabit({
      id: "h1",
      entries: [entry("2026-03-01", "completed"), entry("2026-03-02", "missed")],
    });
    const checkIns = [
      { date: "2026-03-01", energy: 3, mood: 3, stress: 3, focus: 3, context: { travel: true } },
      { date: "2026-03-02", energy: 3, mood: 3, stress: 3, focus: 3, context: null },
    ];
    const drafts = generateContextCorrelationInsights(
      makeContext({ identities: [{ id: "id1", name: "Athlete", systems: [makeSystem("s1", [habit])] }], checkIns }),
    );
    expect(drafts).toHaveLength(0);
  });
});

describe("generateTimeOfDayInsights", () => {
  it("flags a habit that succeeds in the morning but fails at night", () => {
    const dates = Array.from({ length: 10 }, (_, i) => addDaysLocal("2026-03-01", i));
    const entries = dates.map((date, i) =>
      i < 5
        ? entry(date, "completed", new Date(`${date}T08:00:00Z`))
        : entry(date, "missed"),
    );
    const habit = makeHabit({ id: "h1", name: "Strength Session", preferredTime: "22:00", entries });
    const checkIns = dates.map((date) => ({ date, energy: 3, mood: 3, stress: 3, focus: 3, context: null }));

    const drafts = generateTimeOfDayInsights(
      makeContext({ identities: [{ id: "id1", name: "Athlete", systems: [makeSystem("s1", [habit])] }], checkIns }),
    );

    expect(drafts).toHaveLength(1);
    expect(drafts[0].evidence.bestBucket).toBe("morning");
    expect(drafts[0].evidence.worstBucket).toBe("night");
  });

  it("flags a system where morning habits succeed more than night habits, even when neither habit varies internally", () => {
    const dates = Array.from({ length: 20 }, (_, i) => addDaysLocal("2026-03-01", i));
    const morningEntries = dates.map((date) => entry(date, "completed", new Date(`${date}T08:00:00Z`)));
    const nightEntries = dates.map((date, i) =>
      i % 4 === 0 ? entry(date, "completed", new Date(`${date}T22:00:00Z`)) : entry(date, "missed"),
    );
    const morningHabit = makeHabit({ id: "morning-run", name: "Morning Run", preferredTime: "08:00", entries: morningEntries });
    const nightHabit = makeHabit({ id: "strength", name: "Strength Session", preferredTime: "22:00", entries: nightEntries });
    const checkIns = dates.map((date) => ({ date, energy: 3, mood: 3, stress: 3, focus: 3, context: null }));

    const drafts = generateTimeOfDayInsights(
      makeContext({
        identities: [{ id: "id1", name: "Athlete", systems: [makeSystem("s1", [morningHabit, nightHabit])] }],
        checkIns,
      }),
    );

    const crossHabitDraft = drafts.find((d) => d.evidence.systemId === "s1");
    expect(crossHabitDraft).toBeDefined();
    expect(crossHabitDraft?.evidence.bestBucket).toBe("morning");
    expect(crossHabitDraft?.evidence.worstBucket).toBe("night");
  });
});

describe("generateDecliningSystemInsights", () => {
  it("flags a system whose weekly rate has declined for consecutive weeks", () => {
    // referenceDate 2026-03-31 (Tuesday). Weeks (most recent first, 7-day
    // blocks ending on referenceDate): [03-25..03-31], [03-18..03-24], [03-11..03-17]
    const entries: HabitEntryLike[] = [];
    // oldest week: all completed
    for (const date of ["2026-03-11", "2026-03-12", "2026-03-13"]) entries.push(entry(date, "completed"));
    // middle week: half completed
    for (const date of ["2026-03-18", "2026-03-19"]) entries.push(entry(date, "completed"));
    entries.push(entry("2026-03-20", "missed"));
    // most recent week: all missed
    for (const date of ["2026-03-25", "2026-03-26", "2026-03-27"]) entries.push(entry(date, "missed"));

    const habit = makeHabit({ id: "h1", createdAt: new Date("2026-01-01T00:00:00Z"), entries });
    const drafts = generateDecliningSystemInsights(
      makeContext({
        identities: [{ id: "id1", name: "Athlete", systems: [makeSystem("s1", [habit])] }],
        referenceDate: "2026-03-31",
      }),
    );
    expect(drafts).toHaveLength(1);
    expect(drafts[0].kind).toBe("declining_system");
  });

  it("does not fire when a week has no data", () => {
    const habit = makeHabit({ id: "h1", entries: [] });
    const drafts = generateDecliningSystemInsights(
      makeContext({ identities: [{ id: "id1", name: "Athlete", systems: [makeSystem("s1", [habit])] }] }),
    );
    expect(drafts).toHaveLength(0);
  });
});

describe("generateMetricCorrelationInsights", () => {
  it("finds a correlation between a check-in metric and system completion", () => {
    const dates = Array.from({ length: 14 }, (_, i) => addDaysLocal("2026-03-01", i));
    // completion mirrors energy exactly: high energy days succeed, low energy days miss
    const entries = dates.map((date, i) => entry(date, i % 2 === 0 ? "completed" : "missed"));
    const habit = makeHabit({ id: "h1", entries });
    const checkIns = dates.map((date, i) => ({
      date,
      energy: i % 2 === 0 ? 5 : 1,
      mood: 3,
      stress: 3,
      focus: 3,
      context: null,
    }));

    const drafts = generateMetricCorrelationInsights(
      makeContext({ identities: [{ id: "id1", name: "Athlete", systems: [makeSystem("s1", [habit])] }], checkIns }),
    );

    expect(drafts.some((d) => d.evidence.metric === "energy")).toBe(true);
  });
});

describe("generateMinimumRelianceInsights", () => {
  it("flags heavy reliance on the minimum version", () => {
    const entries: HabitEntryLike[] = [
      ...Array.from({ length: 6 }, (_, i) => entry(`2026-03-0${i + 1}`, "minimum")),
      ...Array.from({ length: 4 }, (_, i) => entry(`2026-03-1${i}`, "completed")),
    ];
    const habit = makeHabit({ id: "h1", name: "Read Before Bed", entries });
    const drafts = generateMinimumRelianceInsights(
      makeContext({ identities: [{ id: "id1", name: "Reader", systems: [makeSystem("s1", [habit])] }] }),
    );
    expect(drafts).toHaveLength(1);
    expect(drafts[0].evidence.relianceRate).toBeCloseTo(0.6);
  });

  it("does not fire below the minimum sample size", () => {
    const habit = makeHabit({ id: "h1", entries: [entry("2026-03-01", "minimum")] });
    const drafts = generateMinimumRelianceInsights(
      makeContext({ identities: [{ id: "id1", name: "Reader", systems: [makeSystem("s1", [habit])] }] }),
    );
    expect(drafts).toHaveLength(0);
  });
});

describe("generateInsights", () => {
  it("dedupes a kind that already has a recent, non-dismissed insight", () => {
    const entries: HabitEntryLike[] = [
      ...Array.from({ length: 6 }, (_, i) => entry(`2026-03-0${i + 1}`, "minimum")),
      ...Array.from({ length: 4 }, (_, i) => entry(`2026-03-1${i}`, "completed")),
    ];
    const habit = makeHabit({ id: "h1", entries });
    const context = makeContext({
      identities: [{ id: "id1", name: "Reader", systems: [makeSystem("s1", [habit])] }],
      referenceDate: "2026-03-15",
      existingInsights: [
        {
          kind: "minimum_reliance",
          evidence: { habitId: "h1" },
          createdAt: new Date("2026-03-14T00:00:00Z"),
          dismissedAt: null,
        },
      ],
    });

    expect(generateMinimumRelianceInsights(context)).toHaveLength(1);
    expect(generateInsights(context).filter((d) => d.kind === "minimum_reliance")).toHaveLength(0);
  });

  it("does not dedupe a dismissed insight", () => {
    const entries: HabitEntryLike[] = [
      ...Array.from({ length: 6 }, (_, i) => entry(`2026-03-0${i + 1}`, "minimum")),
      ...Array.from({ length: 4 }, (_, i) => entry(`2026-03-1${i}`, "completed")),
    ];
    const habit = makeHabit({ id: "h1", entries });
    const context = makeContext({
      identities: [{ id: "id1", name: "Reader", systems: [makeSystem("s1", [habit])] }],
      referenceDate: "2026-03-15",
      existingInsights: [
        {
          kind: "minimum_reliance",
          evidence: { habitId: "h1" },
          createdAt: new Date("2026-03-14T00:00:00Z"),
          dismissedAt: new Date("2026-03-14T01:00:00Z"),
        },
      ],
    });

    expect(generateInsights(context).filter((d) => d.kind === "minimum_reliance")).toHaveLength(1);
  });

  it("does not let a recent insight about one habit suppress the same kind about a different habit", () => {
    const entries: HabitEntryLike[] = [
      ...Array.from({ length: 6 }, (_, i) => entry(`2026-03-0${i + 1}`, "minimum")),
      ...Array.from({ length: 4 }, (_, i) => entry(`2026-03-1${i}`, "completed")),
    ];
    const habitA = makeHabit({ id: "h1", entries });
    const habitB = makeHabit({ id: "h2", entries });
    const context = makeContext({
      identities: [{ id: "id1", name: "Reader", systems: [makeSystem("s1", [habitA, habitB])] }],
      referenceDate: "2026-03-15",
      existingInsights: [
        {
          kind: "minimum_reliance",
          evidence: { habitId: "h1" },
          createdAt: new Date("2026-03-14T00:00:00Z"),
          dismissedAt: null,
        },
      ],
    });

    const results = generateInsights(context).filter((d) => d.kind === "minimum_reliance");
    expect(results.map((d) => d.evidence.habitId)).toEqual(["h2"]);
  });
});

describe("daysUntilInsightsAvailable", () => {
  it("reports remaining days per kind based on logged check-ins", () => {
    const context = makeContext({
      checkIns: Array.from({ length: 5 }, (_, i) => ({
        date: addDaysLocal("2026-03-01", i),
        energy: 3,
        mood: 3,
        stress: 3,
        focus: 3,
        context: null,
      })),
    });
    const result = daysUntilInsightsAvailable(context);
    const minimumReliance = result.find((r) => r.kind === "minimum_reliance")!;
    const decliningSystem = result.find((r) => r.kind === "declining_system")!;
    expect(minimumReliance.daysRemaining).toBe(5); // threshold 10, logged 5
    expect(decliningSystem.daysRemaining).toBe(16); // threshold 21, logged 5
  });

  it("reports zero once the threshold is met", () => {
    const context = makeContext({
      checkIns: Array.from({ length: 30 }, (_, i) => ({
        date: addDaysLocal("2026-03-01", i),
        energy: 3,
        mood: 3,
        stress: 3,
        focus: 3,
        context: null,
      })),
    });
    expect(daysUntilInsightsAvailable(context).every((r) => r.daysRemaining === 0)).toBe(true);
  });
});
