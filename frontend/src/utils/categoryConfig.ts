import { HabitCategory } from '../types/habit';

export const categoryConfig: Record<HabitCategory, { label: string; color: string; bgLight: string; bgDark: string }> = {
  spiritual: {
    label: 'Spiritual',
    color: 'text-violet-500',
    bgLight: 'bg-violet-50 border-violet-200',
    bgDark: 'dark:bg-violet-950/30 dark:border-violet-800',
  },
  workout: {
    label: 'Workout',
    color: 'text-emerald-500',
    bgLight: 'bg-emerald-50 border-emerald-200',
    bgDark: 'dark:bg-emerald-950/30 dark:border-emerald-800',
  },
  nutrition: {
    label: 'Nutrition',
    color: 'text-amber-500',
    bgLight: 'bg-amber-50 border-amber-200',
    bgDark: 'dark:bg-amber-950/30 dark:border-amber-800',
  },
  personal: {
    label: 'Personal',
    color: 'text-blue-500',
    bgLight: 'bg-blue-50 border-blue-200',
    bgDark: 'dark:bg-blue-950/30 dark:border-blue-800',
  },
  other: {
    label: 'Other',
    color: 'text-slate-500',
    bgLight: 'bg-slate-50 border-slate-200',
    bgDark: 'dark:bg-slate-800/30 dark:border-slate-700',
  },
};

export const categoryColors: Record<HabitCategory, string> = {
  spiritual: '#8b5cf6',
  workout: '#10b981',
  nutrition: '#f59e0b',
  personal: '#3b82f6',
  other: '#64748b',
};
