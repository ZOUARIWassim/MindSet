import { cn } from "@/lib/cn";
import type { DailyOutcome } from "@/domain/completion";
import { localDateWeekday } from "@/domain/timezone";

const STATUS_CLASSES: Record<string, string> = {
  completed: "bg-accent",
  minimum: "bg-accent/50",
  partial: "bg-amber-400/70 dark:bg-amber-500/60",
  missed: "bg-surface-tertiary",
  skipped_intentionally: "bg-text-muted/30",
  due: "border border-dashed border-border",
};

function classFor(status: DailyOutcome["status"]): string {
  return status ? STATUS_CLASSES[status] : STATUS_CLASSES.due;
}

/**
 * A 12-week GitHub-style grid, deliberately not a streak counter: cells are
 * colored by what happened that day, with no distinction drawn between
 * "day 1 of a run" and "day 40 of a run."
 */
export function HabitHeatmap({ outcomes }: { outcomes: DailyOutcome[] }) {
  // Pad the front so day rows line up with their real weekday (0=Sun..6=Sat),
  // GitHub-heatmap style, regardless of what weekday the window happens to start on.
  const leadingPad = outcomes.length > 0 ? localDateWeekday(outcomes[0].date) : 0;
  const padded: Array<DailyOutcome | null> = [
    ...Array.from({ length: leadingPad }, () => null),
    ...outcomes,
  ];

  const weeks: Array<Array<DailyOutcome | null>> = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {Array.from({ length: 7 }, (_, dayIndex) => {
              const day = week[dayIndex];
              return (
                <div
                  key={dayIndex}
                  title={day ? `${day.date}: ${day.status ?? "not logged"}` : undefined}
                  className={cn("h-3 w-3 rounded-sm", day ? classFor(day.status) : "bg-transparent")}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 text-xs text-text-muted">
        <Legend swatch="bg-accent" label="Completed" />
        <Legend swatch="bg-accent/50" label="Minimum" />
        <Legend swatch="bg-amber-400/70 dark:bg-amber-500/60" label="Partial" />
        <Legend swatch="bg-surface-tertiary" label="Missed" />
        <Legend swatch="bg-text-muted/30" label="Skipped" />
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={cn("h-2.5 w-2.5 rounded-sm", swatch)} />
      {label}
    </span>
  );
}
