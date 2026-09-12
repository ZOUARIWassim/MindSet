import type { DueHabitInput } from "./scheduling";
import type { HabitEntryLike } from "./completion";
import type { LocalDate } from "./timezone";

export type CheckInContextTag = "workload" | "travel" | "illness" | "social" | "unusual";

export interface HabitContext extends DueHabitInput {
  name: string;
  preferredTime: string | null;
  entries: HabitEntryLike[];
}

export interface HabitSystemContext {
  id: string;
  name: string;
  habits: HabitContext[];
}

export interface IdentityContext {
  id: string;
  name: string;
  systems: HabitSystemContext[];
}

export interface CheckInContext {
  date: LocalDate;
  energy: number;
  mood: number;
  stress: number;
  focus: number;
  context: Partial<Record<CheckInContextTag, boolean>> | null;
}

export type InsightKind =
  | "context_correlation"
  | "time_of_day_comparison"
  | "declining_system"
  | "metric_correlation"
  | "minimum_reliance";

export interface ExistingInsight {
  kind: InsightKind;
  createdAt: Date;
  dismissedAt: Date | null;
}

/**
 * A read-only, fully-resolved snapshot of one user's data, assembled by
 * `db/userContext.ts`. This is the single interface the insights engine
 * (and, later, an AI layer) reads from - no direct database access.
 */
export interface UserContext {
  user: { id: string; timezone: string };
  identities: IdentityContext[];
  checkIns: CheckInContext[];
  existingInsights: ExistingInsight[];
  /** "Today" in the user's local timezone, injected rather than read internally so the domain layer stays pure. */
  referenceDate: LocalDate;
}

export function allHabits(context: UserContext): HabitContext[] {
  return context.identities.flatMap((identity) =>
    identity.systems.flatMap((system) => system.habits),
  );
}

export function allSystems(
  context: UserContext,
): Array<{ system: HabitSystemContext; identity: IdentityContext }> {
  return context.identities.flatMap((identity) =>
    identity.systems.map((system) => ({ system, identity })),
  );
}
