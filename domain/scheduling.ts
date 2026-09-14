import { type LocalDate, dateToLocalDate, localDateWeekday } from "./timezone";

export type FrequencyRule =
  | { type: "daily" }
  | { type: "weekdays"; days: number[] } // 0 = Sun .. 6 = Sat, local
  | { type: "n_per_week"; n: number; weekStartsOn?: 0 | 1 };

export type HabitLifecycleStatus = "active" | "paused" | "completed" | "abandoned";

export interface DueHabitInput {
  id: string;
  frequency: FrequencyRule;
  status: HabitLifecycleStatus;
  archivedAt: Date | null;
  createdAt: Date;
}

export type DueHabit<T extends DueHabitInput = DueHabitInput> = T & {
  /**
   * Only meaningful for `n_per_week` habits: true once the week's target
   * has already been met. The habit stays in the due list either way (it's
   * not hidden), so the UI can show it as already-satisfied rather than
   * dropping it from view.
   */
  satisfiedThisWeek: boolean;
};

export function matchesFrequencyDay(frequency: FrequencyRule, weekday: number): boolean {
  switch (frequency.type) {
    case "daily":
      return true;
    case "weekdays":
      return frequency.days.includes(weekday);
    case "n_per_week":
      // Due every day until the week's target is met; callers use
      // `satisfiedThisWeek` to decide how to render it once met.
      return true;
  }
}

function isWithinLifecycle(
  habit: DueHabitInput,
  date: LocalDate,
  timezone: string,
): boolean {
  const createdLocal = dateToLocalDate(habit.createdAt, timezone);
  if (date < createdLocal) return false;
  if (habit.archivedAt) {
    const archivedLocal = dateToLocalDate(habit.archivedAt, timezone);
    if (date >= archivedLocal) return false;
  }
  return true;
}

/**
 * Which of the given habits are due on `date` (a local calendar date) for a
 * user in `timezone`. Paused/completed/abandoned habits are never due.
 * `weekEntryCounts` (keyed by habit id) supplies how many non-missed,
 * non-skipped entries have already been logged this local week, used only
 * to compute `satisfiedThisWeek` for `n_per_week` habits.
 */
export function dueHabits<T extends DueHabitInput>(
  habits: T[],
  date: LocalDate,
  timezone: string,
  weekEntryCounts: Map<string, number> = new Map(),
): DueHabit<T>[] {
  const weekday = localDateWeekday(date);

  return habits
    .filter((habit) => habit.status === "active")
    .filter((habit) => isWithinLifecycle(habit, date, timezone))
    .filter((habit) => matchesFrequencyDay(habit.frequency, weekday))
    .map((habit) => ({
      ...habit,
      satisfiedThisWeek:
        habit.frequency.type === "n_per_week"
          ? (weekEntryCounts.get(habit.id) ?? 0) >= habit.frequency.n
          : false,
    }));
}

export type TimeOfDayBucket = "early_morning" | "morning" | "afternoon" | "evening" | "night";

/** Buckets a "HH:mm" time-of-day string into a coarse part of the day. */
export function bucketForTime(time: string): TimeOfDayBucket {
  const hour = Number(time.split(":")[0]);
  if (hour >= 4 && hour < 8) return "early_morning";
  if (hour >= 8 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}
