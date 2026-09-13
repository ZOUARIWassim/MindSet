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
      <PagerLink date={previous} disabled={!canGoBack}>
        <ChevronLeft size={16} />
      </PagerLink>
      <span className="min-w-[9rem] text-center text-sm font-medium text-text-primary">
        {formatLabel(date, today)}
      </span>
      <PagerLink date={next} disabled={!canGoForward}>
        <ChevronRight size={16} />
      </PagerLink>
    </div>
  );
}

function PagerLink({
  date,
  disabled,
  children,
}: {
  date: LocalDate;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const className = cn(
    "flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-secondary",
    disabled ? "pointer-events-none opacity-40" : "hover:text-text-primary",
  );
  if (disabled) {
    return <span className={className}>{children}</span>;
  }
  return (
    <Link href={`/today?date=${date}`} className={className}>
      {children}
    </Link>
  );
}
