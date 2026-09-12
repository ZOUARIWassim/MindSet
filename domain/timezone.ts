export type LocalDate = string; // 'YYYY-MM-DD', a timezone-independent calendar date

/**
 * Converts an instant to the calendar date it falls on in the given IANA
 * timezone. Uses Intl (real tz-database DST rules) rather than a fixed
 * offset, so this is correct across DST transitions.
 */
export function dateToLocalDate(date: Date, timezone: string): LocalDate {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date);
}

/** The 0-23 hour a given instant falls on in the given IANA timezone. */
export function localHourOf(date: Date, timezone: string): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    hourCycle: "h23",
  });
  return Number(formatter.format(date));
}

/** 0 = Sunday .. 6 = Saturday, for a calendar date string (timezone-agnostic by construction). */
export function localDateWeekday(localDate: LocalDate): number {
  const [y, m, d] = localDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/**
 * Adds (or subtracts) whole calendar days to a local date string. Because
 * LocalDate is already decoupled from any timezone, this arithmetic is done
 * against a UTC-anchored Date so it can never be perturbed by DST.
 */
export function addDaysLocal(localDate: LocalDate, days: number): LocalDate {
  const [y, m, d] = localDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

export function compareLocalDate(a: LocalDate, b: LocalDate): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function enumerateLocalDates(start: LocalDate, end: LocalDate): LocalDate[] {
  const dates: LocalDate[] = [];
  for (let cur = start; compareLocalDate(cur, end) <= 0; cur = addDaysLocal(cur, 1)) {
    dates.push(cur);
  }
  return dates;
}

/** Whole calendar days between two local dates (positive if `b` is after `a`). */
export function daysBetweenLocal(a: LocalDate, b: LocalDate): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const diffMs = Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad);
  return Math.round(diffMs / (24 * 60 * 60 * 1000));
}

/** The local date of the first day of the calendar week containing `localDate`. */
export function startOfWeekLocal(localDate: LocalDate, weekStartsOn: 0 | 1 = 0): LocalDate {
  const weekday = localDateWeekday(localDate);
  const diff = (weekday - weekStartsOn + 7) % 7;
  return addDaysLocal(localDate, -diff);
}
