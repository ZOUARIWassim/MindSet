import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Habit, HabitEntry } from '../types/habit';
import { habitService } from '../services/habitService';
import { useAuth } from './AuthContext';

interface HabitContextType {
  habits: Habit[];
  todayEntries: Map<string, HabitEntry>;
  loading: boolean;
  refreshHabits: () => Promise<void>;
  toggleHabit: (habitId: string) => Promise<void>;
  createHabit: (data: any) => Promise<Habit>;
  updateHabit: (habitId: string, data: Partial<Habit>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayEntries, setTodayEntries] = useState<Map<string, HabitEntry>>(new Map());
  const [loading, setLoading] = useState(true);

  const loadHabits = async () => {
    if (!isAuthenticated) {
      setHabits([]);
      setTodayEntries(new Map());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [habitsData, entriesData] = await Promise.all([
        habitService.getHabits(),
        habitService.getTodayEntries()
      ]);

      setHabits(habitsData);

      const entriesMap = new Map<string, HabitEntry>();
      entriesData.forEach((entry: any) => {
        const habitId = typeof entry.habitId === 'string' ? entry.habitId : entry.habitId._id;
        entriesMap.set(habitId, entry);
      });
      setTodayEntries(entriesMap);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, [isAuthenticated]);

  const refreshHabits = async () => {
    await loadHabits();
  };

  const toggleHabit = async (habitId: string) => {
    try {
      const currentEntry = todayEntries.get(habitId);
      const newCompleted = !currentEntry?.completed;

      const entry = await habitService.logEntry(habitId, newCompleted, new Date());

      setTodayEntries((prev) => {
        const newMap = new Map(prev);
        newMap.set(habitId, entry);
        return newMap;
      });
    } catch (error) {
      console.error('Error toggling habit:', error);
      throw error;
    }
  };

  const createHabit = async (data: any): Promise<Habit> => {
    try {
      const newHabit = await habitService.createHabit(data);
      setHabits((prev) => [newHabit, ...prev]);
      return newHabit;
    } catch (error) {
      console.error('Error creating habit:', error);
      throw error;
    }
  };

  const updateHabit = async (habitId: string, data: Partial<Habit>) => {
    try {
      const updated = await habitService.updateHabit(habitId, data);
      setHabits((prev) => prev.map((h) => h._id === habitId ? updated : h));
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      await habitService.deleteHabit(habitId);
      setHabits((prev) => prev.filter((h) => h._id !== habitId));
      setTodayEntries((prev) => {
        const newMap = new Map(prev);
        newMap.delete(habitId);
        return newMap;
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        todayEntries,
        loading,
        refreshHabits,
        toggleHabit,
        createHabit,
        updateHabit,
        deleteHabit
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
