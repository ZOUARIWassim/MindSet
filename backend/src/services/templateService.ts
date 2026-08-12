import Habit from '../models/Habit';
import { HABIT_TEMPLATES, HabitTemplate } from '../utils/habitTemplates';
import mongoose from 'mongoose';

export const templateService = {
  // Create default habits for a new user
  createDefaultHabits: async (userId: string): Promise<void> => {
    try {
      const habits = HABIT_TEMPLATES.map((template) => ({
        ...template,
        userId: new mongoose.Types.ObjectId(userId),
        active: true
      }));

      await Habit.insertMany(habits);
    } catch (error) {
      console.error('Error creating default habits:', error);
      throw error;
    }
  },

  // Get all available templates
  getTemplates: (): HabitTemplate[] => {
    return HABIT_TEMPLATES;
  },

  // Create habits from selected templates
  createFromTemplates: async (userId: string, templateNames: string[]): Promise<void> => {
    try {
      const selectedTemplates = HABIT_TEMPLATES.filter((t) =>
        templateNames.includes(t.name)
      );

      const habits = selectedTemplates.map((template) => ({
        ...template,
        userId: new mongoose.Types.ObjectId(userId),
        active: true
      }));

      await Habit.insertMany(habits);
    } catch (error) {
      console.error('Error creating habits from templates:', error);
      throw error;
    }
  }
};
