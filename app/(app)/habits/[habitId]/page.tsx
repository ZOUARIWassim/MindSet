import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/db/client";
import { findHabitWithDetailsForUser } from "@/db/repositories/habit";
import { todayLocal } from "@/lib/timezone";
import { addDaysLocal, compareLocalDate, dateToLocalDate } from "@/domain/timezone";
import { dailyOutcomes, rateByWeekday, rateByTimeOfDay, type HabitEntryLike } from "@/domain/completion";
import type { FrequencyRule } from "@/domain/scheduling";
import { HabitHeatmap } from "@/components/habit/HabitHeatmap";
import { WeekdayChart } from "@/components/habit/WeekdayChart";
import { TimeOfDayChart } from "@/components/habit/TimeOfDayChart";
import { ValueTrend } from "@/components/habit/ValueTrend";
import { HabitActions } from "@/components/habit/HabitActions";

const HEATMAP_WEEKS = 12;
const STATS_WINDOW_DAYS = 90;

export default async function HabitDetailPage({
  params,
}: {
  params: Promise<{ habitId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { habitId } = await params;
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
  const habit = await findHabitWithDetailsForUser(habitId, user.id);
  if (!habit) notFound();

  const today = todayLocal(user.timezone);
  const createdLocal = dateToLocalDate(habit.createdAt, user.timezone);

  const heatmapStart = addDaysLocal(today, -(HEATMAP_WEEKS * 7 - 1));
  const statsStart = addDaysLocal(today, -(STATS_WINDOW_DAYS - 1));
  const boundedStatsStart = compareLocalDate(statsStart, createdLocal) > 0 ? statsStart : createdLocal;

  const entries: HabitEntryLike[] = habit.entries.map((entry) => ({
    status: entry.status,
    performedAt: entry.performedAt,
    checkInDate: dateToLocalDate(entry.checkIn.date, user.timezone),
  }));

  const habitInput = {
    id: habit.id,
    frequency: habit.frequency as FrequencyRule,
    status: habit.status,
    archivedAt: habit.archivedAt,
    createdAt: habit.createdAt,
  };

  const heatmap = dailyOutcomes(habitInput, entries, { start: heatmapStart, end: today }, user.timezone);
  const weekdayRates = rateByWeekday(habitInput, entries, { start: boundedStatsStart, end: today }, user.timezone);
  const timeOfDayRates = rateByTimeOfDay(
    { ...habitInput, preferredTime: habit.preferredTime },
    entries,
    { start: boundedStatsStart, end: today },
    user.timezone,
  );

  const valuePoints = habit.entries
    .filter((entry) => entry.value !== null)
    .map((entry) => ({ date: dateToLocalDate(entry.checkIn.date, user.timezone), value: entry.value! }))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <div>
        <Link href={`/identities/${habit.system.identity.id}`} className="text-sm text-text-secondary hover:text-text-primary">
          &larr; {habit.system.identity.name}
        </Link>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">{habit.name}</h1>
            <p className="text-sm text-text-secondary">{habit.behavior}</p>
          </div>
        </div>
        {habit.status === "paused" && (
          <p className="mt-2 text-sm font-medium text-warning-dark">Paused</p>
        )}
        {habit.status === "abandoned" && (
          <p className="mt-2 text-sm font-medium text-text-muted">Abandoned</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-text-secondary sm:grid-cols-3">
        {habit.targetValue !== null && (
          <Stat label="Target" value={`${habit.targetValue}${habit.unit ? ` ${habit.unit}` : ""}`} />
        )}
        {habit.minimumValue !== null && (
          <Stat label="Minimum" value={`${habit.minimumValue}${habit.unit ? ` ${habit.unit}` : ""}`} />
        )}
        {habit.preferredTime && <Stat label="Preferred time" value={habit.preferredTime} />}
        {habit.contextTrigger && <Stat label="Cue" value={habit.contextTrigger} />}
        <Stat label="Difficulty" value={`${habit.difficulty}/5`} />
      </div>

      {habit.reason && (
        <p className="rounded-2xl border border-border bg-surface-secondary p-4 text-sm italic text-text-secondary">
          &ldquo;{habit.reason}&rdquo;
        </p>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">Last 12 weeks</h2>
        <HabitHeatmap outcomes={heatmap} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">By day of week</h2>
        <WeekdayChart rates={weekdayRates} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">By time of day</h2>
        <TimeOfDayChart rates={timeOfDayRates} />
      </section>

      {habit.unit && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">Value trend</h2>
          <ValueTrend points={valuePoints} unit={habit.unit} />
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">Manage</h2>
        <HabitActions
          habit={{
            id: habit.id,
            name: habit.name,
            behavior: habit.behavior,
            targetValue: habit.targetValue,
            minimumValue: habit.minimumValue,
            unit: habit.unit,
            preferredTime: habit.preferredTime,
            contextTrigger: habit.contextTrigger,
            difficulty: habit.difficulty,
            reason: habit.reason,
            status: habit.status,
          }}
        />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="font-medium text-text-primary">{value}</p>
    </div>
  );
}
