import { matchesFrequencyDay } from "../scheduling";
import { weightForStatus, type HabitEntryLike } from "../completion";
import { dateToLocalDate, localDateWeekday, type LocalDate } from "../timezone";
import { allSystems, type CheckInContext, type HabitSystemContext, type UserContext } from "../userContext";
import { metricCorrelation, type MetricPoint } from "../correlation";
import { METRIC_CORRELATION } from "./thresholds";
import type { InsightDraft } from "./types";

const METRICS = ["energy", "mood", "stress", "focus"] as const;

function dailySystemCompletionSeries(
  system: HabitSystemContext,
  checkIns: CheckInContext[],
  timezone: string,
): MetricPoint[] {
  const dailyHabits = system.habits.filter((h) => h.frequency.type !== "n_per_week");
  if (dailyHabits.length === 0) return [];

  const entryByHabitAndDate = new Map<string, Map<LocalDate, HabitEntryLike>>(
    dailyHabits.map((h) => [h.id, new Map(h.entries.map((e) => [e.checkInDate, e]))]),
  );

  const points: MetricPoint[] = [];
  for (const checkIn of checkIns) {
    const weekday = localDateWeekday(checkIn.date);
    const weights: number[] = [];
    for (const habit of dailyHabits) {
      const createdLocal = dateToLocalDate(habit.createdAt, timezone);
      if (checkIn.date < createdLocal) continue;
      if (habit.archivedAt && checkIn.date >= dateToLocalDate(habit.archivedAt, timezone)) continue;
      if (!matchesFrequencyDay(habit.frequency, weekday)) continue;

      const entry = entryByHabitAndDate.get(habit.id)?.get(checkIn.date);
      if (entry?.status === "skipped_intentionally") continue;
      weights.push(entry ? weightForStatus(entry.status, 0.5) : 0);
    }
    if (weights.length > 0) {
      points.push({ date: checkIn.date, value: weights.reduce((s, w) => s + w, 0) / weights.length });
    }
  }
  return points;
}

/**
 * Correlates each system's daily completion with the day's check-in
 * metrics (energy, mood, stress, focus), surfacing the strongest signal.
 */
export function generateMetricCorrelationInsights(
  context: UserContext,
  opts?: { minSampleSize?: number; minAbsCoefficient?: number },
): InsightDraft[] {
  const minSampleSize = opts?.minSampleSize ?? METRIC_CORRELATION.minSampleSize;
  const minAbsCoefficient = opts?.minAbsCoefficient ?? METRIC_CORRELATION.minAbsCoefficient;
  const drafts: InsightDraft[] = [];

  for (const { system, identity } of allSystems(context)) {
    const completionSeries = dailySystemCompletionSeries(system, context.checkIns, context.user.timezone);
    if (completionSeries.length < minSampleSize) continue;

    for (const metric of METRICS) {
      const metricSeries: MetricPoint[] = context.checkIns.map((c) => ({ date: c.date, value: c[metric] }));
      const result = metricCorrelation(metricSeries, completionSeries);
      if (result.n < minSampleSize || Math.abs(result.coefficient) < minAbsCoefficient) continue;

      const direction = result.coefficient > 0 ? "higher" : "lower";
      const dates = completionSeries.map((p) => p.date).sort();
      drafts.push({
        kind: "metric_correlation",
        title: `${system.name} tracks with your ${metric}`,
        body: `On days with ${direction} ${metric}, ${system.name} tends to go better (correlation ${result.coefficient.toFixed(2)} across ${result.n} days). Worth keeping an eye on ${metric} as part of the system.`,
        evidence: {
          systemId: system.id,
          identityId: identity.id,
          metric,
          coefficient: result.coefficient,
          sampleSize: result.n,
        },
        periodStart: dates[0],
        periodEnd: dates[dates.length - 1],
      });
    }
  }

  return drafts;
}
