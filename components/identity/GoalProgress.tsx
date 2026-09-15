import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export function GoalProgress({
  name,
  currentValue,
  targetValue,
  unit,
  importance,
  status,
}: {
  name: string;
  currentValue: number | null;
  targetValue: number | null;
  unit: string | null;
  importance: "low" | "medium" | "high";
  status: "active" | "achieved" | "paused" | "abandoned";
}) {
  const hasProgress = currentValue !== null && targetValue !== null && targetValue > 0;
  const pct = hasProgress ? Math.min(100, Math.round((currentValue! / targetValue!) * 100)) : null;
  const isAchieved = status === "achieved";

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium text-text-primary">{name}</p>
        <span
          className={cn(
            "whitespace-nowrap rounded-full px-2 py-0.5 text-xs",
            importance === "high"
              ? "bg-accent/10 text-accent-dark"
              : "bg-surface-tertiary text-text-muted",
          )}
        >
          {importance} priority
        </span>
      </div>
      {hasProgress && (
        <div className="mt-3 flex flex-col gap-1.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-tertiary">
            <div
              className={cn("h-full rounded-full", isAchieved ? "bg-success" : "bg-accent")}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-text-muted">
            {currentValue}
            {unit ? ` ${unit}` : ""} of {targetValue}
            {unit ? ` ${unit}` : ""}
          </p>
        </div>
      )}
      {isAchieved && (
        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-success-dark">
          <CheckCircle2 size={15} aria-hidden="true" />
          Achieved
        </p>
      )}
    </Card>
  );
}
