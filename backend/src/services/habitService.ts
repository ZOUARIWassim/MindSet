import Habit, { IHabit } from '../models/Habit';
import HabitEntry, { IHabitEntry } from '../models/HabitEntry';
import mongoose from 'mongoose';

export const habitService = {
  // Create a new habit
  createHabit: async (userId: string, habitData: Partial<IHabit>): Promise<IHabit> => {
    const habit = new Habit({
      ...habitData,
      userId: new mongoose.Types.ObjectId(userId)
    });
    return await habit.save();
  },

  // Get all active habits for a user
  getUserHabits: async (userId: string, includeInactive = false): Promise<IHabit[]> => {
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };
    if (!includeInactive) {
      query.active = true;
    }
    return await Habit.find(query).sort({ createdAt: -1 });
  },

  // Get a single habit by ID
  getHabitById: async (habitId: string, userId: string): Promise<IHabit | null> => {
    return await Habit.findOne({
      _id: new mongoose.Types.ObjectId(habitId),
      userId: new mongoose.Types.ObjectId(userId)
    });
  },

  // Update a habit
  updateHabit: async (
    habitId: string,
    userId: string,
    updateData: Partial<IHabit>
  ): Promise<IHabit | null> => {
    return await Habit.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(habitId),
        userId: new mongoose.Types.ObjectId(userId)
      },
      updateData,
      { new: true, runValidators: true }
    );
  },

  // Delete a habit (soft delete by setting active=false)
  deleteHabit: async (habitId: string, userId: string): Promise<IHabit | null> => {
    return await Habit.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(habitId),
        userId: new mongoose.Types.ObjectId(userId)
      },
      { active: false },
      { new: true }
    );
  },

  // Log habit completion
  logHabitEntry: async (
    habitId: string,
    userId: string,
    date: Date,
    completed: boolean,
    value?: number | string,
    notes?: string
  ): Promise<IHabitEntry> => {
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    const entry = await HabitEntry.findOneAndUpdate(
      {
        habitId: new mongoose.Types.ObjectId(habitId),
        date: normalizedDate
      },
      {
        habitId: new mongoose.Types.ObjectId(habitId),
        userId: new mongoose.Types.ObjectId(userId),
        date: normalizedDate,
        completed,
        value,
        notes
      },
      { upsert: true, new: true, runValidators: true }
    );

    return entry;
  },

  // Get habit entries for a date range
  getHabitEntries: async (
    habitId: string,
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IHabitEntry[]> => {
    return await HabitEntry.find({
      habitId: new mongoose.Types.ObjectId(habitId),
      userId: new mongoose.Types.ObjectId(userId),
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });
  },

  // Get all entries for a specific date
  getEntriesByDate: async (userId: string, date: Date): Promise<IHabitEntry[]> => {
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    return await HabitEntry.find({
      userId: new mongoose.Types.ObjectId(userId),
      date: normalizedDate
    }).populate('habitId');
  },

  // Get all entries for a user within a date range (for calendar view)
  getEntriesByDateRange: async (userId: string, startDate: Date, endDate: Date): Promise<IHabitEntry[]> => {
    return await HabitEntry.find({
      userId: new mongoose.Types.ObjectId(userId),
      date: { $gte: startDate, $lte: endDate }
    }).populate('habitId').sort({ date: 1 });
  },

  // Get habit completion statistics
  getHabitStats: async (habitId: string, userId: string, days: number = 30) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await HabitEntry.find({
      habitId: new mongoose.Types.ObjectId(habitId),
      userId: new mongoose.Types.ObjectId(userId),
      date: { $gte: startDate, $lte: endDate }
    });

    const totalEntries = entries.length;
    const completedEntries = entries.filter((e) => e.completed).length;
    const completionRate = totalEntries > 0 ? (completedEntries / totalEntries) * 100 : 0;

    // Calculate current streak
    let currentStreak = 0;
    const sortedEntries = entries.sort((a, b) => b.date.getTime() - a.date.getTime());

    for (const entry of sortedEntries) {
      if (entry.completed) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalEntries,
      completedEntries,
      completionRate: Math.round(completionRate),
      currentStreak
    };
  }
};
