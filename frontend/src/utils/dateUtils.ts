import { format, isToday, isYesterday, isTomorrow, addDays, subDays } from 'date-fns';

export function formatDateLabel(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'EEEE, MMM d');
}

export function formatTime(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

export function parseReminderTimeToHour(reminderTime?: string): number | null {
  if (!reminderTime) return null;
  const match = reminderTime.match(/(\d{1,2}):?(\d{2})?/);
  if (!match) return null;
  return parseInt(match[1], 10);
}

export function getNextDay(date: Date): Date {
  return addDays(date, 1);
}

export function getPrevDay(date: Date): Date {
  return subDays(date, 1);
}
