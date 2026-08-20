import { useState, useEffect } from 'react';
import { habitService } from '../services/habitService';
import { HabitStats } from '../types/habit';

const cache = new Map<string, { stats: HabitStats; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export function useHabitStats(habitId: string, days = 7) {
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = `${habitId}-${days}`;
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setStats(cached.stats);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    habitService.getStats(habitId, days).then((data) => {
      if (cancelled) return;
      cache.set(key, { stats: data, timestamp: Date.now() });
      setStats(data);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [habitId, days]);

  return { stats, loading };
}
