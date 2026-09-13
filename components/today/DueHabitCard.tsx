"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/cn";
import { saveHabitEntry } from "@/app/actions/checkin";
import type { LocalDate } from "@/domain/timezone";
import type { HabitEntryStatus } from "@/domain/completion";

const STATUS_OPTIONS: Array<{ value: HabitEntryStatus; label: string }> = [
  { value: "completed", label: "Complete" },
  { value: "minimum", label: "Minimum" },
  { value: "partial", label: "Partial" },
  { value: "missed", label: "Missed" },
  { value: "skipped_intentionally", label: "Skip" },
];

export function DueHabitCard({
  date,
  habit,
  initialStatus,
  initialValue,
  satisfiedThisWeek,
}: {
  date: LocalDate;
  habit: {
    id: string;
    name: string;
    behavior: string;
    unit: string | null;
    minimumValue: number | null;
  };
  initialStatus: HabitEntryStatus | null;
  initialValue: number | null;
  satisfiedThisWeek: boolean;
}) {
  const [status, setStatus] = useState<HabitEntryStatus | null>(initialStatus);
  const [value, setValue] = useState(initialValue?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function selectStatus(next: HabitEntryStatus) {
    setError(null);
    const previous = status;
    setStatus(next);
    startTransition(async () => {
      try {
        const countsTowardValue = next === "completed" || next === "minimum" || next === "partial";
        await saveHabitEntry(date, habit.id, {
          status: next,
          value: countsTowardValue && value ? Number(value) : undefined,
        });
      } catch {
        setStatus(previous);
        setError("Couldn't save that. Try again.");
      }
    });
  }

  function commitValue() {
    if (!status) return;
    const countsTowardValue = status === "completed" || status === "minimum" || status === "partial";
    if (!countsTowardValue) return;
    startTransition(async () => {
      try {
        await saveHabitEntry(date, habit.id, {
          status,
          value: value ? Number(value) : undefined,
        });
      } catch {
        setError("Couldn't save that. Try again.");
      }
    });
  }

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-surface-secondary p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-text-primary">{habit.name}</p>
          <p className="text-sm text-text-secondary">{habit.behavior}</p>
        </div>
        {satisfiedThisWeek && (
          <span className="whitespace-nowrap rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
            Met this week
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={isPending}
            aria-pressed={status === option.value}
            onClick={() => selectStatus(option.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60",
              status === option.value
                ? "border-accent bg-accent text-white"
                : "border-border bg-surface text-text-secondary hover:text-text-primary",
            )}
          >
            {option.label}
          </button>
        ))}
        {habit.unit && (
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={commitValue}
              placeholder={habit.minimumValue?.toString() ?? "0"}
              className="w-16 rounded-lg border border-border bg-surface px-2 py-1 text-xs text-text-primary outline-none focus:border-accent"
            />
            <span className="text-xs text-text-muted">{habit.unit}</span>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </li>
  );
}
