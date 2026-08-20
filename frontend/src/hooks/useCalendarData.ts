import { useState, useEffect, useMemo, useCallback } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format } from 'date-fns';
import { habitService } from '../services/habitService';
import { HabitEntry } from '../types/habit';

export interface CalendarDayData {
  entries: HabitEntry[];
  completedCount: number;
  totalCount: number;
  completionRate: number;
}

interface UseCalendarDataReturn {
  days: Map<string, CalendarDayData>;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useCalendarData(currentMonth: Date): UseCalendarDataReturn {
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { start, end } = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    return {
      start: startOfWeek(monthStart, { weekStartsOn: 0 }),
      end: endOfWeek(monthEnd, { weekStartsOn: 0 }),
    };
  }, [currentMonth]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await habitService.getEntriesByDateRange(start, end);
      setEntries(data);
    } catch {
      setError('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  }, [start, end]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const days = useMemo(() => {
    const map = new Map<string, CalendarDayData>();

    entries.forEach((entry) => {
      const key = format(new Date(entry.date), 'yyyy-MM-dd');
      const existing = map.get(key) || { entries: [], completedCount: 0, totalCount: 0, completionRate: 0 };
      existing.entries.push(entry);
      existing.totalCount++;
      if (entry.completed) existing.completedCount++;
      existing.completionRate = existing.totalCount > 0 ? existing.completedCount / existing.totalCount : 0;
      map.set(key, existing);
    });

    return map;
  }, [entries]);

  return { days, loading, error, refresh: fetchData };
}
