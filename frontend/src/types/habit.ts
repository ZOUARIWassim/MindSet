export type HabitCategory = 'workout' | 'nutrition' | 'spiritual' | 'personal' | 'other';
export type HabitType = 'boolean' | 'numeric' | 'duration' | 'text';
export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  category: HabitCategory;
  type: HabitType;
  target?: number;
  unit?: string;
  frequency: HabitFrequency;
  reminderTime?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HabitEntry {
  _id: string;
  habitId: string;
  userId: string;
  date: string;
  completed: boolean;
  value?: number | string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHabitData {
  name: string;
  description?: string;
  category: HabitCategory;
  type: HabitType;
  target?: number;
  unit?: string;
  frequency?: HabitFrequency;
  reminderTime?: string;
}

export interface HabitStats {
  totalEntries: number;
  completedEntries: number;
  completionRate: number;
  currentStreak: number;
}
