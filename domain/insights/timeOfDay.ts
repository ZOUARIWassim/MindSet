import { rateByTimeOfDay } from "../completion";
import { allSystems, type UserContext } from "../userContext";
import { compareLocalDate } from "../timezone";
import { TIME_OF_DAY } from "./thresholds";
import type { InsightDraft } from "./types";

/**
 * For each habit, compares its best- and worst-performing time-of-day
 * bucket (based on when it was actually performed, or its preferred time
 * as a fallback).
 */
export function generateTimeOfDayInsights(
  context: UserContext,
  opts?: { minBucketSampleSize?: number; minDeltaRate?: number },
): InsightDraft[] {
  const minBucketSampleSize = opts?.minBucketSampleSize ?? TIME_OF_DAY.minBucketSampleSize;
  const minDeltaRate = opts?.minDeltaRate ?? TIME_OF_DAY.minDeltaRate;
  if (context.checkIns.length === 0) return [];

  const dates = context.checkIns.map((c) => c.date).sort(compareLocalDate);
  const window = { start: dates[0], end: dates[dates.length - 1] };
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
