import type { WeekdayRate } from "@/domain/completion";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeekdayChart({ rates }: { rates: WeekdayRate[] }) {
  const byWeekday = new Map(rates.map((r) => [r.weekday, r]));

  return (
    <div className="flex items-end gap-2">
      {WEEKDAY_LABELS.map((label, weekday) => {
        const rate = byWeekday.get(weekday);
        const height = rate ? Math.max(4, Math.round(rate.rate * 64)) : 4;
        return (
          <div key={label} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex h-16 w-full items-end justify-center">
              <div
                className="w-full max-w-6 rounded-t bg-accent"
                style={{ height, opacity: rate && rate.sampleSize > 0 ? 1 : 0.15 }}
                title={rate ? `${label}: ${Math.round(rate.rate * 100)}% (n=${rate.sampleSize})` : undefined}
              />
            </div>
            <span className="text-xs text-text-muted">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
