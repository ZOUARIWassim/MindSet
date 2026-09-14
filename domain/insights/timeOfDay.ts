import { bucketForTime, type TimeOfDayBucket } from "../scheduling";
import { completionRate, rateByTimeOfDay } from "../completion";
import { allSystems, type UserContext } from "../userContext";
import { compareLocalDate } from "../timezone";
import { TIME_OF_DAY } from "./thresholds";
import type { InsightDraft } from "./types";

function windowOf(context: UserContext): { start: string; end: string } | null {
  if (context.checkIns.length === 0) return null;
  const dates = context.checkIns.map((c) => c.date).sort(compareLocalDate);
  return { start: dates[0], end: dates[dates.length - 1] };
}

/** Same habit, compared against its own best- and worst-performing time-of-day bucket. */
function generateWithinHabitInsights(
  context: UserContext,
  window: { start: string; end: string },
  minBucketSampleSize: number,
  minDeltaRate: number,
): InsightDraft[] {
  const drafts: InsightDraft[] = [];

  for (const { system, identity } of allSystems(context)) {
    for (const habit of system.habits) {
      const buckets = rateByTimeOfDay(habit, habit.entries, window, context.user.timezone).filter(
        (b) => b.sampleSize >= minBucketSampleSize,
      );
      if (buckets.length < 2) continue;

      const best = buckets.reduce((a, b) => (b.rate > a.rate ? b : a));
      const worst = buckets.reduce((a, b) => (b.rate < a.rate ? b : a));
      if (best.bucket === worst.bucket || best.rate - worst.rate < minDeltaRate) continue;

      drafts.push({
        kind: "time_of_day_comparison",
        title: `${habit.name} depends on timing`,
        body: `${habit.name} succeeds ${Math.round(best.rate * 100)}% of the time in the ${best.bucket.replace("_", " ")}, but only ${Math.round(worst.rate * 100)}% in the ${worst.bucket.replace("_", " ")}. The system, not your willpower, seems to work better at one time than the other.`,
        evidence: {
          habitId: habit.id,
          identityId: identity.id,
          bestBucket: best.bucket,
          bestRate: best.rate,
          worstBucket: worst.bucket,
          worstRate: worst.rate,
        },
        periodStart: window.start,
        periodEnd: window.end,
      });
    }
  }

  return drafts;
}

/**
 * Different habits in the same system, scheduled at different times of day,
 * compared by their own completion rates - catches the case where each
 * habit always happens at a fixed time (so it has no internal time-of-day
 * variance to compare against itself), but some times of day clearly work
 * better than others across the system.
 */
function generateAcrossHabitInsights(
  context: UserContext,
  window: { start: string; end: string },
  minBucketSampleSize: number,
  minDeltaRate: number,
): InsightDraft[] {
  const drafts: InsightDraft[] = [];

  for (const { system, identity } of allSystems(context)) {
    const byBucket = new Map<TimeOfDayBucket, Array<{ habitId: string; rate: number }>>();

    for (const habit of system.habits) {
      if (!habit.preferredTime) continue;
      const result = completionRate(habit, habit.entries, window, context.user.timezone);
      if (result.eligibleDays < minBucketSampleSize) continue;

      const bucket = bucketForTime(habit.preferredTime);
      const list = byBucket.get(bucket);
      if (list) list.push({ habitId: habit.id, rate: result.rate });
      else byBucket.set(bucket, [{ habitId: habit.id, rate: result.rate }]);
    }

    const bucketAverages = Array.from(byBucket.entries()).map(([bucket, habits]) => ({
      bucket,
      rate: habits.reduce((sum, h) => sum + h.rate, 0) / habits.length,
      habitIds: habits.map((h) => h.habitId),
    }));
    if (bucketAverages.length < 2) continue;

    const best = bucketAverages.reduce((a, b) => (b.rate > a.rate ? b : a));
    const worst = bucketAverages.reduce((a, b) => (b.rate < a.rate ? b : a));
    if (best.bucket === worst.bucket || best.rate - worst.rate < minDeltaRate) continue;

    drafts.push({
      kind: "time_of_day_comparison",
      title: `${system.name} works better at some times than others`,
      body: `Habits scheduled in the ${best.bucket.replace("_", " ")} succeed ${Math.round(best.rate * 100)}% of the time in ${system.name}, versus ${Math.round(worst.rate * 100)}% in the ${worst.bucket.replace("_", " ")}. Worth designing around the time that already works.`,
      evidence: {
        systemId: system.id,
        identityId: identity.id,
        bestBucket: best.bucket,
        bestRate: best.rate,
        worstBucket: worst.bucket,
        worstRate: worst.rate,
      },
      periodStart: window.start,
      periodEnd: window.end,
    });
  }

  return drafts;
}

export function generateTimeOfDayInsights(
  context: UserContext,
  opts?: { minBucketSampleSize?: number; minDeltaRate?: number },
): InsightDraft[] {
  const minBucketSampleSize = opts?.minBucketSampleSize ?? TIME_OF_DAY.minBucketSampleSize;
  const minDeltaRate = opts?.minDeltaRate ?? TIME_OF_DAY.minDeltaRate;
  const window = windowOf(context);
  if (!window) return [];

  return [
    ...generateWithinHabitInsights(context, window, minBucketSampleSize, minDeltaRate),
    ...generateAcrossHabitInsights(context, window, minBucketSampleSize, minDeltaRate),
  ];
}
