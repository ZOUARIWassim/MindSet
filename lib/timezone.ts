import { dateToLocalDate, type LocalDate } from "@/domain/timezone";

/** Today's calendar date in the given IANA timezone, right now. */
export function todayLocal(timezone: string): LocalDate {
  return dateToLocalDate(new Date(), timezone);
}

/** Converts a 'YYYY-MM-DD' local date into the UTC-midnight Date Prisma's `@db.Date` columns expect. */
export function localDateToUtcMidnight(date: LocalDate): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}
