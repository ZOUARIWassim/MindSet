import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { addDaysLocal, compareLocalDate, type LocalDate } from "@/domain/timezone";

function formatLabel(date: LocalDate, today: LocalDate): string {
  if (date === today) return "Today";
  if (date === addDaysLocal(today, -1)) return "Yesterday";
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function DatePager({ date, today }: { date: LocalDate; today: LocalDate }) {
  const earliest = addDaysLocal(today, -6);
  const previous = addDaysLocal(date, -1);
  const next = addDaysLocal(date, 1);
  const canGoBack = compareLocalDate(previous, earliest) >= 0;
  const canGoForward = compareLocalDate(next, today) <= 0;

  return (
    <div className="flex items-center gap-3">
      <PagerLink date={previous} disabled={!canGoBack} label="Previous day">
        <ChevronLeft size={16} aria-hidden="true" />
      </PagerLink>
      <span className="min-w-[9rem] text-center text-sm font-medium text-text-primary">
        {formatLabel(date, today)}
      </span>
      <PagerLink date={next} disabled={!canGoForward} label="Next day">
        <ChevronRight size={16} aria-hidden="true" />
      </PagerLink>
    </div>
  );
}

function PagerLink({
  date,
  disabled,
  label,
  children,
}: {
  date: LocalDate;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const className = cn(
    "flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-secondary",
    disabled ? "pointer-events-none opacity-40" : "hover:text-text-primary",
  );
  if (disabled) {
    return (
      <span className={className} aria-hidden="true">
        {children}
      </span>
    );
  }
  return (
    <Link href={`/today?date=${date}`} aria-label={label} className={className}>
      {children}
    </Link>
  );
}
