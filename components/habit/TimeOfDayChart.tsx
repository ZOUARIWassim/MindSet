import type { TimeOfDayRate } from "@/domain/completion";

const BUCKET_LABELS: Record<TimeOfDayRate["bucket"], string> = {
  early_morning: "Early AM",
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

const CHART_HEIGHT = 72;

export function TimeOfDayChart({ rates }: { rates: TimeOfDayRate[] }) {
  return (
    <div className="flex items-end gap-2">
      {rates.map((rate) => {
        const hasData = rate.sampleSize > 0;
        const height = hasData ? Math.max(6, Math.round(rate.rate * CHART_HEIGHT)) : 0;

        return (
          <div key={rate.bucket} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs font-medium text-text-secondary">
              {hasData ? `${Math.round(rate.rate * 100)}%` : "–"}
            </span>
            <div
              className="relative flex w-full items-end justify-center border-t border-dashed border-border/50"
              style={{ height: CHART_HEIGHT }}
            >
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-border/30" />
              {hasData ? (
                <div
                  className="w-full max-w-8 rounded-t bg-accent"
                  style={{ height }}
                  title={`${BUCKET_LABELS[rate.bucket]}: ${Math.round(rate.rate * 100)}% (n=${rate.sampleSize})`}
                />
              ) : (
                <div className="mb-0 h-1.5 w-full max-w-8 rounded-full border border-dashed border-border" />
              )}
            </div>
            <span className="text-center text-xs text-text-muted">{BUCKET_LABELS[rate.bucket]}</span>
          </div>
        );
      })}
    </div>
  );
}
