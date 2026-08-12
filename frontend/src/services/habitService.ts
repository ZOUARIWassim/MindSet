import api from './api';
import { Habit, HabitEntry, CreateHabitData, HabitStats } from '../types/habit';

export const habitService = {
  // Get all user habits
  getHabits: async (includeInactive = false): Promise<Habit[]> => {
    const response = await api.get<{ habits: Habit[] }>('/habits', {
      params: { includeInactive }
    });
    return response.data.habits;
  },

  // Create a new habit
  createHabit: async (data: CreateHabitData): Promise<Habit> => {
    const response = await api.post<{ habit: Habit }>('/habits', data);
    return response.data.habit;
  },

  // Get a single habit
  getHabit: async (habitId: string): Promise<Habit> => {
    const response = await api.get<{ habit: Habit }>(`/habits/${habitId}`);
    return response.data.habit;
  },

  // Update a habit
  updateHabit: async (habitId: string, data: Partial<Habit>): Promise<Habit> => {
    const response = await api.put<{ habit: Habit }>(`/habits/${habitId}`, data);
    return response.data.habit;
  },

  // Delete a habit
  deleteHabit: async (habitId: string): Promise<void> => {
    await api.delete(`/habits/${habitId}`);
  },

  // Log habit entry
  logEntry: async (
    habitId: string,
    completed: boolean,
    date?: Date,
    value?: number | string,
    notes?: string
  ): Promise<HabitEntry> => {
    const response = await api.post<{ entry: HabitEntry }>(`/habits/${habitId}/entries`, {
      completed,
      date: date?.toISOString(),
      value,
      notes
    });
    return response.data.entry;
  },

  // Get habit entries
  getEntries: async (habitId: string, startDate?: Date, endDate?: Date): Promise<HabitEntry[]> => {
    const response = await api.get<{ entries: HabitEntry[] }>(`/habits/${habitId}/entries`, {
      params: {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      }
    });
    return response.data.entries;
  },

  // Get today's entries
  getTodayEntries: async (): Promise<HabitEntry[]> => {
    const response = await api.get<{ entries: HabitEntry[] }>('/habits/entries/today');
    return response.data.entries;
  },

  // Get habit statistics
  getStats: async (habitId: string, days = 30): Promise<HabitStats> => {
    const response = await api.get<{ stats: HabitStats }>(`/habits/${habitId}/stats`, {
      params: { days }
    });
    return response.data.stats;
  }
};
