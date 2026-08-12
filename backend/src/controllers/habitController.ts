import { Response } from 'express';
import { AuthRequest } from '../types';
import { habitService } from '../services/habitService';

// Create a new habit
export const createHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const habitData = req.body;

    const habit = await habitService.createHabit(userId, habitData);

    res.status(201).json({
      message: 'Habit created successfully',
      habit
    });
  } catch (error: any) {
    console.error('Create habit error:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Server error creating habit' });
    }
  }
};

// Get all user habits
export const getUserHabits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const includeInactive = req.query.includeInactive === 'true';

    const habits = await habitService.getUserHabits(userId, includeInactive);

    res.status(200).json({ habits });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ error: 'Server error fetching habits' });
  }
};

// Get a single habit by ID
export const getHabitById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { habitId } = req.params;

    const habit = await habitService.getHabitById(habitId, userId);

    if (!habit) {
      res.status(404).json({ error: 'Habit not found' });
      return;
    }

    res.status(200).json({ habit });
  } catch (error) {
    console.error('Get habit error:', error);
    res.status(500).json({ error: 'Server error fetching habit' });
  }
};

// Update a habit
export const updateHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { habitId } = req.params;
    const updateData = req.body;

    const habit = await habitService.updateHabit(habitId, userId, updateData);

    if (!habit) {
      res.status(404).json({ error: 'Habit not found' });
      return;
    }

    res.status(200).json({
      message: 'Habit updated successfully',
      habit
    });
  } catch (error: any) {
    console.error('Update habit error:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Server error updating habit' });
    }
  }
};

// Delete a habit
export const deleteHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { habitId } = req.params;

    const habit = await habitService.deleteHabit(habitId, userId);

    if (!habit) {
      res.status(404).json({ error: 'Habit not found' });
      return;
    }

    res.status(200).json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ error: 'Server error deleting habit' });
  }
};

// Log habit entry
export const logHabitEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { habitId } = req.params;
    const { date, completed, value, notes } = req.body;

    const entryDate = date ? new Date(date) : new Date();

    const entry = await habitService.logHabitEntry(
      habitId,
      userId,
      entryDate,
      completed,
      value,
      notes
    );

    res.status(201).json({
      message: 'Habit entry logged successfully',
      entry
    });
  } catch (error: any) {
    console.error('Log habit entry error:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Server error logging habit entry' });
    }
  }
};

// Get habit entries
export const getHabitEntries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { habitId } = req.params;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date();
    const end = endDate ? new Date(endDate as string) : new Date();

    start.setDate(start.getDate() - 30);

    const entries = await habitService.getHabitEntries(habitId, userId, start, end);

    res.status(200).json({ entries });
  } catch (error) {
    console.error('Get habit entries error:', error);
    res.status(500).json({ error: 'Server error fetching habit entries' });
  }
};

// Get all entries for today
export const getTodayEntries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const entries = await habitService.getEntriesByDate(userId, today);

    res.status(200).json({ entries, date: today });
  } catch (error) {
    console.error('Get today entries error:', error);
    res.status(500).json({ error: 'Server error fetching today\'s entries' });
  }
};

// Get habit statistics
export const getHabitStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { habitId } = req.params;
    const days = parseInt(req.query.days as string) || 30;

    const stats = await habitService.getHabitStats(habitId, userId, days);

    res.status(200).json({ stats });
  } catch (error) {
    console.error('Get habit stats error:', error);
    res.status(500).json({ error: 'Server error fetching habit statistics' });
  }
};
