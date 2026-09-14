import { dueDatesInWindow, weightForStatus, type HabitEntryLike } from "../completion";
import type { CheckInContext, CheckInContextTag, UserContext } from "../userContext";
import { allSystems } from "../userContext";
import { compareLocalDate } from "../timezone";
import { CONTEXT_CORRELATION } from "./thresholds";
import type { InsightDraft } from "./types";

const TAGS: CheckInContextTag[] = ["workload", "travel", "illness", "social", "unusual"];

function windowOf(checkIns: CheckInContext[]): { start: string; end: string } | null {
  if (checkIns.length === 0) return null;
  const dates = checkIns.map((c) => c.date).sort(compareLocalDate);
  return { start: dates[0], end: dates[dates.length - 1] };
}

/**
 * Compares a habit's completion rate on days tagged with a given context
 * (workload/travel/illness/social/unusual) against days without it.
 */
export function generateContextCorrelationInsights(
  context: UserContext,
  opts?: { minGroupSampleSize?: number; minDeltaRate?: number },
): InsightDraft[] {
  const minGroupSampleSize = opts?.minGroupSampleSize ?? CONTEXT_CORRELATION.minGroupSampleSize;
  const minDeltaRate = opts?.minDeltaRate ?? CONTEXT_CORRELATION.minDeltaRate;
  const window = windowOf(context.checkIns);
  if (!window) return [];

  const checkInByDate = new Map(context.checkIns.map((c) => [c.date, c]));
  const drafts: InsightDraft[] = [];

  for (const { system, identity } of allSystems(context)) {
    for (const habit of system.habits) {
      if (habit.frequency.type === "n_per_week") continue;

      const dueDates = dueDatesInWindow(habit, window, context.user.timezone);
      const entryByDate = new Map(habit.entries.map((e) => [e.checkInDate, e]));

      for (const tag of TAGS) {
        const withTag: number[] = [];
        const withoutTag: number[] = [];

        for (const date of dueDates) {
          const checkIn = checkInByDate.get(date);
          if (!checkIn) continue; // can't classify a day with no check-in
          const entry: HabitEntryLike | undefined = entryByDate.get(date);
          if (entry?.status === "skipped_intentionally") continue;
          const weight = entry ? weightForStatus(entry.status, 0.5) : 0;
          (checkIn.context?.[tag] ? withTag : withoutTag).push(weight);
        }

        if (withTag.length < minGroupSampleSize || withoutTag.length < minGroupSampleSize) continue;

        const rateWith = withTag.reduce((s, w) => s + w, 0) / withTag.length;
        const rateWithout = withoutTag.reduce((s, w) => s + w, 0) / withoutTag.length;
        const delta = rateWithout - rateWith;
        if (Math.abs(delta) < minDeltaRate) continue;

        const better = delta < 0; // completes more often WITH the tag present
        drafts.push({
          kind: "context_correlation",
          title: `${habit.name} and ${tag}`,
          body: better
            ? `${habit.name} actually goes better on ${tag} days: ${Math.round(rateWith * 100)}% vs ${Math.round(rateWithout * 100)}% otherwise. Worth understanding why.`
            : `${habit.name} tends to slip on ${tag} days: ${Math.round(rateWith * 100)}% vs ${Math.round(rateWithout * 100)}% on other days. That's useful information about the system, not a personal failing - it might need a backup plan for those days.`,
          evidence: {
            habitId: habit.id,
            identityId: identity.id,
            tag,
            rateWithTag: rateWith,
            rateWithoutTag: rateWithout,
            sampleSizeWithTag: withTag.length,
            sampleSizeWithoutTag: withoutTag.length,
          },
          periodStart: window.start,
          periodEnd: window.end,
        });
      }
    }
  }

  return drafts;
}
