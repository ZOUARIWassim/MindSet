import type { TimeOfDayRate } from "@/domain/completion";

const BUCKET_LABELS: Record<TimeOfDayRate["bucket"], string> = {
  early_morning: "Early AM",
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

export function TimeOfDayChart({ rates }: { rates: TimeOfDayRate[] }) {
  return (
    <div className="flex items-end gap-2">
      {rates.map((rate) => {
        const height = rate.sampleSize > 0 ? Math.max(4, Math.round(rate.rate * 64)) : 4;
        return (
          <div key={rate.bucket} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex h-16 w-full items-end justify-center">
              <div
                className="w-full max-w-8 rounded-t bg-accent"
                style={{ height, opacity: rate.sampleSize > 0 ? 1 : 0.15 }}
                title={`${BUCKET_LABELS[rate.bucket]}: ${Math.round(rate.rate * 100)}% (n=${rate.sampleSize})`}
              />
            </div>
            <span className="text-center text-xs text-text-muted">{BUCKET_LABELS[rate.bucket]}</span>
          </div>
        );
      })}
    </div>
  );
}
