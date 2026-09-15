import { Hourglass } from "lucide-react";
import type { InsightKind } from "@/domain/userContext";

const KIND_LABELS: Record<InsightKind, string> = {
  context_correlation: "how context affects your habits",
  time_of_day_comparison: "how timing affects your habits",
  declining_system: "whether a system is slipping",
  metric_correlation: "how your energy and mood track with your systems",
  minimum_reliance: "how much your minimum versions are carrying you",
};

export function InsightGate({
  pending,
}: {
  pending: Array<{ kind: InsightKind; daysRemaining: number }>;
}) {
  if (pending.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border/70 bg-surface-secondary/40 p-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-tertiary text-text-muted">
          <Hourglass size={15} aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-text-primary">Still gathering data</p>
      </div>
      <ul className="flex flex-col gap-1 pl-11 text-sm text-text-secondary">
        {pending.map(({ kind, daysRemaining }) => (
          <li key={kind}>
            {daysRemaining} more day{daysRemaining === 1 ? "" : "s"} of check-ins until insights about{" "}
            {KIND_LABELS[kind]}.
          </li>
        ))}
      </ul>
      <p className="pl-11 text-xs text-text-muted">
        Keep checking in - the system needs a bit more data to say anything useful.
      </p>
    </div>
  );
}
