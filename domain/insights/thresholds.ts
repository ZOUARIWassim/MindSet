import type { InsightKind } from "../userContext";

/**
 * How many days of check-in history are needed before each insight kind is
 * even attempted. Drives the "keep checking in, N more days until insights"
 * gating copy in the UI.
 */
export const MIN_CHECKIN_DAYS: Record<InsightKind, number> = {
  minimum_reliance: 10,
  context_correlation: 14,
  time_of_day_comparison: 14,
  metric_correlation: 14,
  declining_system: 21,
};

export const CONTEXT_CORRELATION = {
  minGroupSampleSize: 4,
  minDeltaRate: 0.2,
};

export const TIME_OF_DAY = {
  minBucketSampleSize: 5,
  minDeltaRate: 0.2,
};

export const DECLINING_SYSTEM = {
  consecutiveDecliningWeeks: 3,
};

export const METRIC_CORRELATION = {
  minSampleSize: 10,
  minAbsCoefficient: 0.3,
};

export const MINIMUM_RELIANCE = {
  minSampleSize: 10,
  minRelianceRate: 0.3,
};

/** Don't regenerate the same kind of insight more often than this. */
export const INSIGHT_COOLDOWN_DAYS = 7;
