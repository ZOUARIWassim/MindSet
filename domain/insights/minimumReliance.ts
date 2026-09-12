import { allSystems, type UserContext } from "../userContext";
import { compareLocalDate } from "../timezone";
import { MINIMUM_RELIANCE } from "./thresholds";
import type { InsightDraft } from "./types";

/**
 * How often a habit's minimum version is what saved the day. Framed as a
 * sign the system is working as designed, not as a shortfall.
 */
export function generateMinimumRelianceInsights(
  context: UserContext,
  opts?: { minSampleSize?: number; minRelianceRate?: number },
): InsightDraft[] {
  const minSampleSize = opts?.minSampleSize ?? MINIMUM_RELIANCE.minSampleSize;
  const minRelianceRate = opts?.minRelianceRate ?? MINIMUM_RELIANCE.minRelianceRate;
  const drafts: InsightDraft[] = [];

  for (const { system, identity } of allSystems(context)) {
    for (const habit of system.habits) {
      const counted = habit.entries.filter(
        (e) => e.status === "completed" || e.status === "minimum" || e.status === "partial",
      );
      if (counted.length < minSampleSize) continue;

      const minimumCount = counted.filter((e) => e.status === "minimum").length;
      const relianceRate = minimumCount / counted.length;
      if (relianceRate < minRelianceRate) continue;

      const dates = habit.entries.map((e) => e.checkInDate).sort(compareLocalDate);
      drafts.push({
        kind: "minimum_reliance",
        title: `The minimum version is doing real work for ${habit.name}`,
        body: `${Math.round(relianceRate * 100)}% of your successful ${habit.name} days were the minimum version, not the full one. That's the system working exactly as designed - the minimum kept the identity alive on hard days.`,
        evidence: {
          habitId: habit.id,
          identityId: identity.id,
          relianceRate,
          minimumCount,
          sampleSize: counted.length,
        },
        periodStart: dates[0],
        periodEnd: dates[dates.length - 1],
      });
    }
  }

  return drafts;
}
