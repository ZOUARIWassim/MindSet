import { completionRate } from "../completion";
import { allSystems, type UserContext } from "../userContext";
import { addDaysLocal } from "../timezone";
import { DECLINING_SYSTEM } from "./thresholds";
import type { InsightDraft } from "./types";

function weeklyRate(
  habits: Parameters<typeof completionRate>[0][],
  entriesByHabit: Map<string, Parameters<typeof completionRate>[1]>,
  weekStart: string,
  timezone: string,
): { rate: number; sampleSize: number } {
  const weekEnd = addDaysLocal(weekStart, 6);
  const results = habits.map((habit) =>
    completionRate(habit, entriesByHabit.get(habit.id) ?? [], { start: weekStart, end: weekEnd }, timezone),
  );
  const sampleSize = results.reduce((sum, r) => sum + r.eligibleDays, 0);
  const rate = results.length > 0 ? results.reduce((sum, r) => sum + r.rate, 0) / results.length : 0;
  return { rate, sampleSize };
}

/**
 * Flags a system whose weekly completion rate has declined for several
 * consecutive weeks - a prompt to look at the system, not a scorecard.
 */
export function generateDecliningSystemInsights(
  context: UserContext,
  opts?: { consecutiveDecliningWeeks?: number },
): InsightDraft[] {
  const weeksRequired = opts?.consecutiveDecliningWeeks ?? DECLINING_SYSTEM.consecutiveDecliningWeeks;
  const drafts: InsightDraft[] = [];

  for (const { system, identity } of allSystems(context)) {
    if (system.habits.length === 0) continue;
    const entriesByHabit = new Map(system.habits.map((h) => [h.id, h.entries]));

    // Most recent week first: week 0 ends at referenceDate.
    const weeks: Array<{ start: string; rate: number; sampleSize: number }> = [];
    for (let i = 0; i < weeksRequired; i++) {
      const weekStart = addDaysLocal(context.referenceDate, -(6 + i * 7));
      const { rate, sampleSize } = weeklyRate(system.habits, entriesByHabit, weekStart, context.user.timezone);
      weeks.push({ start: weekStart, rate, sampleSize });
    }

    if (weeks.some((w) => w.sampleSize === 0)) continue;

    // weeks[0] is most recent; declining means each week back in time was better.
    const isDeclining = weeks.every((week, i) => i === 0 || week.rate > weeks[i - 1].rate);
    if (!isDeclining) continue;

    const oldest = weeks[weeks.length - 1];
    const newest = weeks[0];
    drafts.push({
      kind: "declining_system",
      title: `${system.name} has been slipping`,
      body: `${system.name}'s completion rate has dropped for ${weeksRequired} weeks straight, from ${Math.round(oldest.rate * 100)}% to ${Math.round(newest.rate * 100)}%. That's a signal to adjust the system - maybe the targets are too high right now, not that you're failing.`,
      evidence: {
        systemId: system.id,
        identityId: identity.id,
        weeklyRates: weeks.map((w) => ({ weekStart: w.start, rate: w.rate, sampleSize: w.sampleSize })),
      },
      periodStart: oldest.start,
      periodEnd: addDaysLocal(newest.start, 6),
    });
  }

  return drafts;
}
