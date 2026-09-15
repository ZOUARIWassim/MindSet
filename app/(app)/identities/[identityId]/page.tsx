import { notFound, redirect } from "next/navigation";
import { Layers } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/db/client";
import { findIdentityWithDetailsForUser } from "@/db/repositories/identity";
import { localDateToUtcMidnight, todayLocal } from "@/lib/timezone";
import { addDaysLocal, dateToLocalDate } from "@/domain/timezone";
import { completionRate, type HabitEntryLike } from "@/domain/completion";
import type { FrequencyRule } from "@/domain/scheduling";
import { IdentityHeader } from "@/components/identity/IdentityHeader";
import { GoalProgress } from "@/components/identity/GoalProgress";
import { SystemList, type SystemWithProgress } from "@/components/identity/SystemList";
import { EmptyState } from "@/components/ui/EmptyState";

const WINDOW_DAYS = 30;

export default async function IdentityPage({
  params,
}: {
  params: Promise<{ identityId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { identityId } = await params;
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
  const today = todayLocal(user.timezone);
  const windowStart = addDaysLocal(today, -(WINDOW_DAYS - 1));

  const identity = await findIdentityWithDetailsForUser(
    identityId,
    user.id,
    localDateToUtcMidnight(windowStart),
  );
  if (!identity) notFound();

  const systems: SystemWithProgress[] = identity.systems.map((system) => ({
    id: system.id,
    name: system.name,
    description: system.description,
    habits: system.habits.map((habit) => {
      const entries: HabitEntryLike[] = habit.entries.map((entry) => ({
        status: entry.status,
        performedAt: entry.performedAt,
        checkInDate: dateToLocalDate(entry.checkIn.date, user.timezone),
      }));
      const result = completionRate(
        {
          id: habit.id,
          frequency: habit.frequency as FrequencyRule,
          status: habit.status,
          archivedAt: habit.archivedAt,
          createdAt: habit.createdAt,
        },
        entries,
        { start: windowStart, end: today },
        user.timezone,
      );
      return {
        id: habit.id,
        name: habit.name,
        behavior: habit.behavior,
        status: habit.status,
        count: result.completedCount + result.minimumCount,
        total: result.eligibleDays,
        pct: Math.round(result.rate * 100),
      };
    }),
  }));

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <IdentityHeader name={identity.name} statement={identity.statement} description={identity.description} />

      {identity.goals.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">Goals</h2>
          {identity.goals.map((goal) => (
            <GoalProgress
              key={goal.id}
              name={goal.name}
              currentValue={goal.currentValue}
              targetValue={goal.targetValue}
              unit={goal.unit}
              importance={goal.importance}
              status={goal.status}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">Systems</h2>
        {systems.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No systems yet"
            description="Systems are the containers for your habits."
          />
        ) : (
          <SystemList systems={systems} />
        )}
      </div>
    </div>
  );
}
