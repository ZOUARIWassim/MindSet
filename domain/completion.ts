import {
  type DueHabitInput,
  type TimeOfDayBucket,
  bucketForTime,
  matchesFrequencyDay,
} from "./scheduling";
import {
  type LocalDate,
  addDaysLocal,
  compareLocalDate,
  dateToLocalDate,
  enumerateLocalDates,
  localDateWeekday,
  localHourOf,
  startOfWeekLocal,
} from "./timezone";

export type HabitEntryStatus =
  | "completed"
  | "minimum"
  | "partial"
  | "missed"
  | "skipped_intentionally";

export interface HabitEntryLike {
  status: HabitEntryStatus;
  performedAt: Date | null;
  /** The local calendar date of the CheckIn this entry belongs to. */
  checkInDate: LocalDate;
}

export interface Window {
  start: LocalDate;
  end: LocalDate;
}

export interface CompletionRateResult {
  rate: number;
  completedCount: number;
  minimumCount: number;
  partialCount: number;
  missedCount: number;
  skippedCount: number;
  /** The denominator: due days (or due weeks, for n_per_week habits) that count toward the rate. */
  eligibleDays: number;
}

const DEFAULT_PARTIAL_WEIGHT = 0.5;

function habitLifecycleBounds(
  habit: DueHabitInput,
  timezone: string,
): { createdLocal: LocalDate; archivedLocal: LocalDate | null } {
  return {
    createdLocal: dateToLocalDate(habit.createdAt, timezone),
    archivedLocal: habit.archivedAt ? dateToLocalDate(habit.archivedAt, timezone) : null,
  };
}

function isDueDate(
  date: LocalDate,
  createdLocal: LocalDate,
  archivedLocal: LocalDate | null,
): boolean {
  if (date < createdLocal) return false;
  if (archivedLocal && date >= archivedLocal) return false;
  return true;
}

/** Due calendar dates in `window` for a daily/weekdays habit (not meaningful for n_per_week). */
export function dueDatesInWindow(habit: DueHabitInput, window: Window, timezone: string): LocalDate[] {
  const { createdLocal, archivedLocal } = habitLifecycleBounds(habit, timezone);
  return enumerateLocalDates(window.start, window.end).filter(
    (date) =>
      isDueDate(date, createdLocal, archivedLocal) &&
      matchesFrequencyDay(habit.frequency, localDateWeekday(date)),
  );
}

export function weightForStatus(status: HabitEntryStatus, partialWeight: number): number {
  switch (status) {
    case "completed":
    case "minimum":
      return 1;
    case "partial":
      return partialWeight;
    case "missed":
    case "skipped_intentionally":
      return 0;
  }
}

function tallyStatus(
  status: HabitEntryStatus,
  tally: Omit<CompletionRateResult, "rate" | "eligibleDays">,
): void {
  if (status === "completed") tally.completedCount++;
  else if (status === "minimum") tally.minimumCount++;
  else if (status === "partial") tally.partialCount++;
  else if (status === "missed") tally.missedCount++;
  else tally.skippedCount++;
}

function emptyTally(): Omit<CompletionRateResult, "rate" | "eligibleDays"> {
  return { completedCount: 0, minimumCount: 0, partialCount: 0, missedCount: 0, skippedCount: 0 };
}

function completionRateForDailyHabit(
  habit: DueHabitInput,
  entries: HabitEntryLike[],
  window: Window,
  timezone: string,
  partialWeight: number,
): CompletionRateResult {
  const dueDates = dueDatesInWindow(habit, window, timezone);
  const entryByDate = new Map(entries.map((e) => [e.checkInDate, e]));
  const tally = emptyTally();
  let weightedSuccess = 0;
  let eligibleDays = 0;

  for (const date of dueDates) {
    const entry = entryByDate.get(date);
    if (!entry) {
      tally.missedCount++;
      eligibleDays++;
      continue;
    }
    if (entry.status === "skipped_intentionally") {
      tally.skippedCount++;
      continue; // excluded from the denominator entirely
    }
    tallyStatus(entry.status, tally);
    weightedSuccess += weightForStatus(entry.status, partialWeight);
    eligibleDays++;
  }

  return { rate: eligibleDays > 0 ? weightedSuccess / eligibleDays : 0, eligibleDays, ...tally };
}

function completionRateForNPerWeekHabit(
  habit: DueHabitInput,
  frequency: Extract<import("./scheduling").FrequencyRule, { type: "n_per_week" }>,
  entries: HabitEntryLike[],
  window: Window,
  timezone: string,
  partialWeight: number,
): CompletionRateResult {
  const { createdLocal, archivedLocal } = habitLifecycleBounds(habit, timezone);
  const weekStartsOn = frequency.weekStartsOn ?? 0;

  const weeks = new Set<LocalDate>();
  for (const date of enumerateLocalDates(window.start, window.end)) {
    if (!isDueDate(date, createdLocal, archivedLocal)) continue;
    weeks.add(startOfWeekLocal(date, weekStartsOn));
  }

  const entriesByWeek = new Map<LocalDate, HabitEntryLike[]>();
  for (const entry of entries) {
    const weekKey = startOfWeekLocal(entry.checkInDate, weekStartsOn);
    if (!weeks.has(weekKey)) continue;
    const list = entriesByWeek.get(weekKey);
    if (list) list.push(entry);
    else entriesByWeek.set(weekKey, [entry]);
  }

  const tally = emptyTally();
  let weightedSuccess = 0;

  for (const weekKey of weeks) {
    let weekWeighted = 0;
    for (const entry of entriesByWeek.get(weekKey) ?? []) {
      tallyStatus(entry.status, tally);
      weekWeighted += weightForStatus(entry.status, partialWeight);
    }
    weightedSuccess += Math.min(weekWeighted / frequency.n, 1);
  }

  return {
    rate: weeks.size > 0 ? weightedSuccess / weeks.size : 0,
    eligibleDays: weeks.size,
    ...tally,
  };
}

/**
 * The completion rate for a habit over a window of local calendar dates.
 * `completed` and `minimum` both count as a full success (the product rule:
 * a minimum-version day is a real success, not a partial one).
 * `skipped_intentionally` is removed from the denominator entirely rather
 * than counted against the user. For `n_per_week` habits, the unit of the
 * rate is the calendar week, not the day.
 */
export function completionRate(
  habit: DueHabitInput,
  entries: HabitEntryLike[],
  window: Window,
  timezone: string,
  opts?: { partialWeight?: number },
): CompletionRateResult {
  const partialWeight = opts?.partialWeight ?? DEFAULT_PARTIAL_WEIGHT;
  return habit.frequency.type === "n_per_week"
    ? completionRateForNPerWeekHabit(habit, habit.frequency, entries, window, timezone, partialWeight)
    : completionRateForDailyHabit(habit, entries, window, timezone, partialWeight);
}

export interface WeekdayRate {
  weekday: number;
  rate: number;
  sampleSize: number;
}

/**
 * Completion rate broken down by local weekday. For `n_per_week` habits,
 * there's no fixed due schedule, so the breakdown is over logged entries
 * only (which weekdays this habit tends to actually get done on).
 */
export function rateByWeekday(
  habit: DueHabitInput,
  entries: HabitEntryLike[],
  window: Window,
  timezone: string,
  opts?: { partialWeight?: number },
): WeekdayRate[] {
  const partialWeight = opts?.partialWeight ?? DEFAULT_PARTIAL_WEIGHT;
  const buckets = new Map<number, { success: number; total: number }>();
  for (let weekday = 0; weekday < 7; weekday++) buckets.set(weekday, { success: 0, total: 0 });

  if (habit.frequency.type === "n_per_week") {
    for (const entry of entries) {
      if (compareLocalDate(entry.checkInDate, window.start) < 0) continue;
      if (compareLocalDate(entry.checkInDate, window.end) > 0) continue;
      if (entry.status === "skipped_intentionally") continue;
      const bucket = buckets.get(localDateWeekday(entry.checkInDate))!;
      bucket.total++;
      bucket.success += weightForStatus(entry.status, partialWeight);
    }
  } else {
    const dueDates = dueDatesInWindow(habit, window, timezone);
    const entryByDate = new Map(entries.map((e) => [e.checkInDate, e]));
    for (const date of dueDates) {
      const bucket = buckets.get(localDateWeekday(date))!;
      const entry = entryByDate.get(date);
      if (entry?.status === "skipped_intentionally") continue;
      bucket.total++;
      bucket.success += entry ? weightForStatus(entry.status, partialWeight) : 0;
    }
  }

  return Array.from(buckets.entries()).map(([weekday, { success, total }]) => ({
    weekday,
    rate: total > 0 ? success / total : 0,
    sampleSize: total,
  }));
}

export interface TimeOfDayRate {
  bucket: TimeOfDayBucket;
  rate: number;
  sampleSize: number;
}

const ALL_BUCKETS: TimeOfDayBucket[] = [
  "early_morning",
  "morning",
  "afternoon",
  "evening",
  "night",
];

/**
 * Completion rate broken down by time of day the habit was actually
 * performed. Uses `HabitEntry.performedAt` when present; a due day with no
 * entry (or an entry with no recorded time) falls back to the habit's
 * `preferredTime`, since that's the best available estimate of when it was
 * expected to happen.
 */
export function rateByTimeOfDay(
  habit: DueHabitInput & { preferredTime: string | null },
  entries: HabitEntryLike[],
  window: Window,
  timezone: string,
  opts?: { partialWeight?: number },
): TimeOfDayRate[] {
  const partialWeight = opts?.partialWeight ?? DEFAULT_PARTIAL_WEIGHT;
  const buckets = new Map<TimeOfDayBucket, { success: number; total: number }>();
  for (const bucket of ALL_BUCKETS) buckets.set(bucket, { success: 0, total: 0 });

  const fallbackBucket = habit.preferredTime ? bucketForTime(habit.preferredTime) : null;

  function bucketFor(entry: HabitEntryLike | undefined): TimeOfDayBucket | null {
    if (entry?.performedAt) return bucketForTime(localHourOf(entry.performedAt, timezone) + ":00");
    return fallbackBucket;
  }

  if (habit.frequency.type === "n_per_week") {
    for (const entry of entries) {
      if (compareLocalDate(entry.checkInDate, window.start) < 0) continue;
      if (compareLocalDate(entry.checkInDate, window.end) > 0) continue;
      if (entry.status === "skipped_intentionally") continue;
      const bucketKey = bucketFor(entry);
      if (!bucketKey) continue;
      const bucket = buckets.get(bucketKey)!;
      bucket.total++;
      bucket.success += weightForStatus(entry.status, partialWeight);
    }
  } else {
    const dueDates = dueDatesInWindow(habit, window, timezone);
    const entryByDate = new Map(entries.map((e) => [e.checkInDate, e]));
    for (const date of dueDates) {
      const entry = entryByDate.get(date);
      if (entry?.status === "skipped_intentionally") continue;
      const bucketKey = bucketFor(entry);
      if (!bucketKey) continue;
      const bucket = buckets.get(bucketKey)!;
      bucket.total++;
      bucket.success += entry ? weightForStatus(entry.status, partialWeight) : 0;
    }
  }

  return ALL_BUCKETS.map((bucket) => {
    const { success, total } = buckets.get(bucket)!;
    return { bucket, rate: total > 0 ? success / total : 0, sampleSize: total };
  });
}

export interface SystemHealth {
  systemId: string;
  rate: number;
  perHabit: Array<{ habitId: string; rate: number }>;
  trend: "improving" | "declining" | "flat";
  sampleSize: number;
}

const TREND_THRESHOLD = 0.05;

/**
 * Overall health of a system: the average completion rate across its
 * habits, plus a trend relative to the equal-length window immediately
 * preceding `window`.
 */
export function systemHealth(
  system: { id: string },
  habits: DueHabitInput[],
  entriesByHabit: Map<string, HabitEntryLike[]>,
  window: Window,
  timezone: string,
): SystemHealth {
  const perHabit = habits.map((habit) => ({
    habitId: habit.id,
    rate: completionRate(habit, entriesByHabit.get(habit.id) ?? [], window, timezone).rate,
  }));
  const sampleSize = habits.reduce(
    (sum, habit) =>
      sum + completionRate(habit, entriesByHabit.get(habit.id) ?? [], window, timezone).eligibleDays,
    0,
  );
  const rate = perHabit.length > 0 ? perHabit.reduce((s, h) => s + h.rate, 0) / perHabit.length : 0;

  const windowLengthDays =
    enumerateLocalDates(window.start, window.end).length;
  const previousWindow: Window = {
    start: addDaysLocal(window.start, -windowLengthDays),
    end: addDaysLocal(window.start, -1),
  };
  const previousRates = habits.map(
    (habit) =>
      completionRate(habit, entriesByHabit.get(habit.id) ?? [], previousWindow, timezone).rate,
  );
  const previousRate =
    previousRates.length > 0 ? previousRates.reduce((s, r) => s + r, 0) / previousRates.length : rate;

  const trend: SystemHealth["trend"] =
    rate - previousRate > TREND_THRESHOLD
      ? "improving"
      : previousRate - rate > TREND_THRESHOLD
        ? "declining"
        : "flat";

  return { systemId: system.id, rate, perHabit, trend, sampleSize };
}

export interface DailyOutcome {
  date: LocalDate;
  status: HabitEntryStatus | null;
}

/**
 * The per-day status of a habit across a window, for a heatmap-style view.
 * `status: null` means the day was due but nothing was logged - deliberately
 * not a "streak broken" signal, just an unlogged day. Works for `n_per_week`
 * habits too, since every calendar day is a due day for them.
 */
export function dailyOutcomes(habit: DueHabitInput, entries: HabitEntryLike[], window: Window, timezone: string): DailyOutcome[] {
  const dueDates = dueDatesInWindow(habit, window, timezone);
  const entryByDate = new Map(entries.map((e) => [e.checkInDate, e]));
  return dueDates.map((date) => ({ date, status: entryByDate.get(date)?.status ?? null }));
}
