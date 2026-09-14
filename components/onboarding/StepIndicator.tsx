import { cn } from "@/lib/cn";

const STEPS = ["Identity", "System", "Habits"];

export function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === current;
        const isDone = stepNumber < current;
        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                isActive && "bg-accent text-white",
                isDone && "bg-accent/20 text-accent",
                !isActive && !isDone && "bg-surface-tertiary text-text-muted",
              )}
            >
              {stepNumber}
            </span>
            <span className={cn("text-sm", isActive ? "text-text-primary" : "text-text-muted")}>
              {label}
            </span>
            {stepNumber < STEPS.length && <span className="mx-1 h-px w-6 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}
