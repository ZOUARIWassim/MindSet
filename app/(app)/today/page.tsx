import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/db/client";
import { getCheckInForDate, weekEntryCountsForUser } from "@/db/repositories/checkin";
import { localDateToUtcMidnight, todayLocal } from "@/lib/timezone";
import { addDaysLocal, compareLocalDate, startOfWeekLocal, type LocalDate } from "@/domain/timezone";
import { dueHabits, type FrequencyRule } from "@/domain/scheduling";
import type { HabitEntryStatus } from "@/domain/completion";
import { EmptyState } from "@/components/ui/EmptyState";
import { DueHabitCard } from "@/components/today/DueHabitCard";
import { CheckInMetaForm } from "@/components/today/CheckInMetaForm";
import { DatePager } from "@/components/today/DatePager";

function resolveDate(requested: string | undefined, today: LocalDate): LocalDate {
  if (!requested || !/^\d{4}-\d{2}-\d{2}$/.test(requested)) return today;
  const earliest = addDaysLocal(today, -6);
  if (compareLocalDate(requested, earliest) < 0 || compareLocalDate(requested, today) > 0) return today;
  return requested;
}

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
  const today = todayLocal(user.timezone);
  const { date: requestedDate } = await searchParams;
  const date = resolveDate(requestedDate, today);

  const habits = await prisma.habit.findMany({
    where: { system: { identity: { userId: user.id } }, status: "active" },
  });

  const weekStart = startOfWeekLocal(date);
  const weekEntryCounts = await weekEntryCountsForUser(
    user.id,
    localDateToUtcMidnight(weekStart),
    localDateToUtcMidnight(addDaysLocal(weekStart, 6)),
  );

  const due = dueHabits(
    habits.map((habit) => ({
      id: habit.id,
      frequency: habit.frequency as FrequencyRule,
      status: habit.status,
      archivedAt: habit.archivedAt,
      createdAt: habit.createdAt,
    })),
    date,
    user.timezone,
    weekEntryCounts,
  );
  const habitById = new Map(habits.map((habit) => [habit.id, habit]));

  const checkIn = await getCheckInForDate(user.id, localDateToUtcMidnight(date));
  const entryByHabitId = new Map(checkIn?.entries.map((entry) => [entry.habitId, entry]) ?? []);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Today</h1>
          <p className="text-sm text-text-secondary">
            {due.length === 0
              ? "Nothing scheduled."
              : `${due.length} habit${due.length === 1 ? "" : "s"} due.`}
          </p>
        </div>
        <DatePager date={date} today={today} />
      </div>

      {due.length === 0 ? (
        <EmptyState
          title="Nothing due"
          description="Your habits will show up here as soon as they're scheduled for this day."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {due.map((entry) => {
            const habit = habitById.get(entry.id)!;
            const existing = entryByHabitId.get(habit.id);
            return (
              <DueHabitCard
                key={habit.id}
                date={date}
                habit={{
                  id: habit.id,
                  name: habit.name,
                  behavior: habit.behavior,
                  unit: habit.unit,
                  minimumValue: habit.minimumValue,
                }}
                initialStatus={(existing?.status as HabitEntryStatus | undefined) ?? null}
                initialValue={existing?.value ?? null}
                satisfiedThisWeek={entry.satisfiedThisWeek}
              />
            );
          })}
        </ul>
      )}

      <CheckInMetaForm
        date={date}
        initial={{
          energy: checkIn?.energy ?? 3,
          mood: checkIn?.mood ?? 3,
          stress: checkIn?.stress ?? 3,
          focus: checkIn?.focus ?? 3,
          note: checkIn?.note ?? "",
        }}
      />
    </div>
  );
}
