import { dateToLocalDate, type LocalDate } from "@/domain/timezone";

/** Today's calendar date in the given IANA timezone, right now. */
export function todayLocal(timezone: string): LocalDate {
  return dateToLocalDate(new Date(), timezone);
}
