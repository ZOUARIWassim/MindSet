"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle, CheckCircle2, CircleDashed, CircleSlash, MinusCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { saveHabitEntry } from "@/app/actions/checkin";
import type { LocalDate } from "@/domain/timezone";
import type { HabitEntryStatus } from "@/domain/completion";

const STATUS_OPTIONS: Array<{
  value: HabitEntryStatus;
  label: string;
  icon: typeof CheckCircle2;
  selectedClasses: string;
}> = [
  {
    value: "completed",
    label: "Complete",
    icon: CheckCircle2,
    selectedClasses: "border-transparent bg-success text-white",
  },
  {
    value: "minimum",
    label: "Minimum",
    icon: CheckCircle,
    selectedClasses: "border-success/40 bg-success-surface text-success-dark",
  },
  {
    value: "partial",
    label: "Partial",
    icon: CircleDashed,
    selectedClasses: "border-warning/40 bg-warning-surface text-warning-dark",
  },
  {
    value: "missed",
    label: "Missed",
    icon: MinusCircle,
    selectedClasses: "border-border bg-missed-surface text-text-secondary",
  },
  {
    value: "skipped_intentionally",
    label: "Skip",
    icon: CircleSlash,
    selectedClasses: "border-skipped/30 bg-skipped-surface text-skipped",
  },
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
  const [isPending, startTransition] = useTransition();

  function selectStatus(next: HabitEntryStatus) {
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
        toast.error(`Couldn't save "${habit.name}". Try again.`);
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
        toast.error(`Couldn't save "${habit.name}". Try again.`);
      }
    });
  }

  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-secondary p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-text-primary">{habit.name}</p>
          <p className="text-sm text-text-secondary">{habit.behavior}</p>
        </div>
        {satisfiedThisWeek && (
          <span className="whitespace-nowrap rounded-full bg-success-surface px-2 py-1 text-xs font-medium text-success-dark">
            Met this week
          </span>
        )}
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {STATUS_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = status === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={isPending}
              aria-pressed={isSelected}
              aria-label={option.label}
              onClick={() => selectStatus(option.value)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg border py-2 text-xs font-medium transition-colors duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 sm:flex-row",
                isSelected
                  ? option.selectedClasses
                  : "border-border bg-surface text-text-secondary hover:bg-surface-tertiary hover:text-text-primary",
              )}
            >
              <Icon size={15} aria-hidden="true" />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          );
        })}
      </div>

      {habit.unit && (
        <div className="flex items-center gap-1.5 self-start">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commitValue}
            placeholder={habit.minimumValue?.toString() ?? "0"}
            aria-label={`Value in ${habit.unit}`}
            className="w-16 rounded-lg border border-border bg-surface px-2 py-1 text-xs text-text-primary outline-none focus:border-accent"
          />
          <span className="text-xs text-text-muted">{habit.unit}</span>
        </div>
      )}
    </li>
  );
}
