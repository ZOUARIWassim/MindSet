import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/db/client";
import { todayLocal } from "@/lib/timezone";
import { dueHabits, type FrequencyRule } from "@/domain/scheduling";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function TodayPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
  const habits = await prisma.habit.findMany({
    where: { system: { identity: { userId: user.id } }, status: "active" },
  });

  const today = todayLocal(user.timezone);
  const due = dueHabits(
    habits.map((habit) => ({
      id: habit.id,
      frequency: habit.frequency as FrequencyRule,
      status: habit.status,
      archivedAt: habit.archivedAt,
      createdAt: habit.createdAt,
    })),
    today,
    user.timezone,
  );
  const habitById = new Map(habits.map((habit) => [habit.id, habit]));

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Today</h1>
        <p className="text-sm text-text-secondary">
          {due.length === 0
            ? "Nothing scheduled for today."
            : `${due.length} habit${due.length === 1 ? "" : "s"} due today.`}
        </p>
      </div>

      {due.length === 0 ? (
        <EmptyState
          title="Nothing due today"
          description="Your habits will show up here as soon as they're scheduled for today."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {due.map((entry) => {
            const habit = habitById.get(entry.id)!;
            return (
              <li
                key={habit.id}
                className="flex flex-col gap-1 rounded-xl border border-border bg-surface-secondary p-4"
              >
                <span className="font-medium text-text-primary">{habit.name}</span>
                <span className="text-sm text-text-secondary">{habit.behavior}</span>
                {entry.satisfiedThisWeek && (
                  <span className="text-xs font-medium text-accent">Already met this week</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
