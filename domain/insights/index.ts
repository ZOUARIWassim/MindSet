import type { InsightKind, UserContext } from "../userContext";
import { dateToLocalDate, daysBetweenLocal } from "../timezone";
import { generateContextCorrelationInsights } from "./contextCorrelation";
import { generateTimeOfDayInsights } from "./timeOfDay";
import { generateDecliningSystemInsights } from "./decliningSystem";
import { generateMetricCorrelationInsights } from "./metricCorrelation";
import { generateMinimumRelianceInsights } from "./minimumReliance";
import { INSIGHT_COOLDOWN_DAYS, MIN_CHECKIN_DAYS } from "./thresholds";
import type { InsightDraft } from "./types";

export type { InsightDraft } from "./types";
export { generateContextCorrelationInsights } from "./contextCorrelation";
export { generateTimeOfDayInsights } from "./timeOfDay";
export { generateDecliningSystemInsights } from "./decliningSystem";
export { generateMetricCorrelationInsights } from "./metricCorrelation";
export { generateMinimumRelianceInsights } from "./minimumReliance";

const ALL_KINDS: InsightKind[] = [
  "context_correlation",
  "time_of_day_comparison",
  "declining_system",
  "metric_correlation",
  "minimum_reliance",
];

/**
 * The identity of an insight for dedupe purposes: which specific habit,
 * system, or (falling back) account-wide pattern it's about. Two insights
 * of the same kind about *different* habits are not duplicates.
 */
function scopeKeyOf(kind: string, evidence: Record<string, unknown>): string {
  const scope = evidence.habitId ?? evidence.systemId ?? evidence.identityId ?? "account";
  return `${kind}:${scope}`;
}

/**
 * Runs every insight generator and drops drafts that would duplicate a
 * still-relevant (not dismissed, within the cooldown window) existing
 * insight of the same kind and scope (same habit/system, not just same kind).
 */
export function generateInsights(context: UserContext): InsightDraft[] {
  const drafts = [
    ...generateContextCorrelationInsights(context),
    ...generateTimeOfDayInsights(context),
    ...generateDecliningSystemInsights(context),
    ...generateMetricCorrelationInsights(context),
    ...generateMinimumRelianceInsights(context),
  ];

  const recentActiveScopes = new Set(
    context.existingInsights
      .filter((insight) => insight.dismissedAt === null)
      .filter(
        (insight) =>
          daysBetweenLocal(
            dateToLocalDate(insight.createdAt, context.user.timezone),
            context.referenceDate,
          ) < INSIGHT_COOLDOWN_DAYS,
      )
      .map((insight) => scopeKeyOf(insight.kind, insight.evidence)),
  );

  return drafts.filter((draft) => !recentActiveScopes.has(scopeKeyOf(draft.kind, draft.evidence)));
}

/** How many more days of check-ins are needed before each insight kind can fire. */
export function daysUntilInsightsAvailable(
  context: UserContext,
): Array<{ kind: InsightKind; daysRemaining: number }> {
  const loggedDays = context.checkIns.length;
  return ALL_KINDS.map((kind) => ({
    kind,
    daysRemaining: Math.max(0, MIN_CHECKIN_DAYS[kind] - loggedDays),
  }));
}
