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
    <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border p-4">
      <p className="text-sm font-medium text-text-primary">Still gathering data</p>
      <ul className="flex flex-col gap-1 text-sm text-text-secondary">
        {pending.map(({ kind, daysRemaining }) => (
          <li key={kind}>
            {daysRemaining} more day{daysRemaining === 1 ? "" : "s"} of check-ins until insights about{" "}
            {KIND_LABELS[kind]}.
          </li>
        ))}
      </ul>
      <p className="text-xs text-text-muted">Keep checking in - the system needs a bit more data to say anything useful.</p>
    </div>
  );
}
