import { prisma } from "./client";
import { dateToLocalDate } from "../domain/timezone";
import { todayLocal } from "../lib/timezone";
import type { FrequencyRule } from "../domain/scheduling";
import type {
  CheckInContext,
  CheckInContextTag,
  ExistingInsight,
  HabitContext,
  IdentityContext,
  UserContext,
} from "../domain/userContext";

/**
 * Assembles the full read-only UserContext the insights engine (and, later,
 * an AI layer) reads from. This is the only place that turns Prisma models
 * into the domain layer's shapes - everything downstream is pure.
 */
export async function assembleUserContext(userId: string): Promise<UserContext> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  const identities = await prisma.identity.findMany({
    where: { userId, archivedAt: null },
    orderBy: { order: "asc" },
    include: {
      systems: {
        orderBy: { order: "asc" },
        include: {
          habits: {
            where: { status: { not: "abandoned" } },
            include: { entries: { include: { checkIn: true } } },
          },
        },
      },
    },
  });

  const checkIns = await prisma.checkIn.findMany({ where: { userId }, orderBy: { date: "asc" } });

  const existingInsights = await prisma.insight.findMany({ where: { userId } });

  const identityContexts: IdentityContext[] = identities.map((identity) => ({
    id: identity.id,
    name: identity.name,
    systems: identity.systems.map((system) => ({
      id: system.id,
      name: system.name,
      habits: system.habits.map((habit): HabitContext => ({
        id: habit.id,
        name: habit.name,
        frequency: habit.frequency as FrequencyRule,
        status: habit.status,
        archivedAt: habit.archivedAt,
        createdAt: habit.createdAt,
        preferredTime: habit.preferredTime,
        entries: habit.entries.map((entry) => ({
          status: entry.status,
          performedAt: entry.performedAt,
          checkInDate: dateToLocalDate(entry.checkIn.date, user.timezone),
        })),
      })),
    })),
  }));

  const checkInContexts: CheckInContext[] = checkIns.map((checkIn) => ({
    date: dateToLocalDate(checkIn.date, user.timezone),
    energy: checkIn.energy,
    mood: checkIn.mood,
    stress: checkIn.stress,
    focus: checkIn.focus,
    context: checkIn.context as Partial<Record<CheckInContextTag, boolean>> | null,
  }));

  const existingInsightRecords: ExistingInsight[] = existingInsights.map((insight) => ({
    kind: insight.kind,
    evidence: insight.evidence as Record<string, unknown>,
    createdAt: insight.createdAt,
    dismissedAt: insight.dismissedAt,
  }));

  return {
    user: { id: user.id, timezone: user.timezone },
    identities: identityContexts,
    checkIns: checkInContexts,
    existingInsights: existingInsightRecords,
    referenceDate: todayLocal(user.timezone),
  };
}
