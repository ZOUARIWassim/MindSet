"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { dismissInsightAction } from "@/app/actions/insight";

const KIND_LABELS: Record<string, string> = {
  context_correlation: "Context",
  time_of_day_comparison: "Timing",
  declining_system: "System health",
  metric_correlation: "Correlation",
  minimum_reliance: "Minimum version",
};

function formatEvidenceValue(key: string, value: unknown): string {
  if (typeof value === "number") {
    if (key.toLowerCase().includes("rate") || key.toLowerCase().includes("coefficient")) {
      return key.toLowerCase().includes("coefficient") ? value.toFixed(2) : `${Math.round(value * 100)}%`;
    }
    return value.toString();
  }
  if (Array.isArray(value)) return `${value.length} data point${value.length === 1 ? "" : "s"}`;
  return String(value);
}

export function InsightCard({
  id,
  kind,
  title,
  body,
  evidence,
}: {
  id: string;
  kind: string;
  title: string;
  body: string;
  evidence: Record<string, unknown>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDismiss() {
    startTransition(async () => {
      await dismissInsightAction(id);
      router.refresh();
    });
  }

  const evidenceEntries = Object.entries(evidence).filter(
    ([key]) => !["habitId", "systemId", "identityId"].includes(key),
  );

  return (
    <Card data-testid="insight-card" data-insight-id={id}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
            {KIND_LABELS[kind] ?? kind}
          </span>
          <p className="mt-1 font-medium text-text-primary">{title}</p>
        </div>
        <Button variant="ghost" onClick={handleDismiss} disabled={isPending}>
          Dismiss
        </Button>
      </div>
      <p className="mt-2 text-sm text-text-secondary">{body}</p>
      {evidenceEntries.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
          {evidenceEntries.map(([key, value]) => (
            <span key={key}>
              {key}: {formatEvidenceValue(key, value)}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
