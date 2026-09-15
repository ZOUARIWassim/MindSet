import type { WeekdayRate } from "@/domain/completion";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CHART_HEIGHT = 72;

export function WeekdayChart({ rates }: { rates: WeekdayRate[] }) {
  const byWeekday = new Map(rates.map((r) => [r.weekday, r]));

  return (
    <div className="flex items-end gap-2">
      {WEEKDAY_LABELS.map((label, weekday) => {
        const rate = byWeekday.get(weekday);
        const hasData = !!rate && rate.sampleSize > 0;
        const height = hasData ? Math.max(6, Math.round(rate.rate * CHART_HEIGHT)) : 0;

        return (
          <div key={label} className="flex flex-1 flex-col items-center gap-1">
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
                  className="w-full max-w-6 rounded-t bg-accent"
                  style={{ height }}
                  title={`${label}: ${Math.round(rate.rate * 100)}% (n=${rate.sampleSize})`}
                />
              ) : (
                <div className="mb-0 h-1.5 w-full max-w-6 rounded-full border border-dashed border-border" />
              )}
            </div>
            <span className="text-xs text-text-muted">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
