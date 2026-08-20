import { HabitCategory, HabitType, HabitFrequency } from '../models/Habit';

export interface HabitTemplate {
  name: string;
  description: string;
  category: HabitCategory;
  type: HabitType;
  frequency: HabitFrequency;
  target?: number;
  unit?: string;
  reminderTime?: string;
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  // Spiritual Habits — 5 Daily Prayers
  {
    name: 'Fajr Prayer',
    description: 'Complete Fajr (dawn) prayer on time',
    category: 'spiritual',
    type: 'boolean',
    frequency: 'daily',
    reminderTime: '05:00'
  },
  {
    name: 'Dhuhr Prayer',
    description: 'Complete Dhuhr (noon) prayer on time',
    category: 'spiritual',
    type: 'boolean',
    frequency: 'daily',
    reminderTime: '13:00'
  },
  {
    name: 'Asr Prayer',
    description: 'Complete Asr (afternoon) prayer on time',
    category: 'spiritual',
    type: 'boolean',
    frequency: 'daily',
    reminderTime: '16:30'
  },
  {
    name: 'Maghrib Prayer',
    description: 'Complete Maghrib (sunset) prayer on time',
    category: 'spiritual',
    type: 'boolean',
    frequency: 'daily',
    reminderTime: '19:30'
  },
  {
    name: 'Isha Prayer',
    description: 'Complete Isha (night) prayer on time',
    category: 'spiritual',
    type: 'boolean',
    frequency: 'daily',
    reminderTime: '21:00'
  },
  {
    name: 'Quran Reading',
    description: 'Read Quran daily',
    category: 'spiritual',
    type: 'numeric',
    frequency: 'daily',
    target: 2,
    unit: 'pages',
    reminderTime: '05:30'
  },

  // Workout Habits — Gym Splits
  {
    name: 'Push Day',
    description: 'Chest, shoulders, triceps workout',
    category: 'workout',
    type: 'boolean',
    frequency: 'daily'
  },
  {
    name: 'Pull Day',
    description: 'Back, biceps, rear delts workout',
    category: 'workout',
    type: 'boolean',
    frequency: 'daily'
  },
  {
    name: 'Legs Day',
    description: 'Quads, hamstrings, glutes, calves workout',
    category: 'workout',
    type: 'boolean',
    frequency: 'daily'
  },
  {
    name: 'Upper Body',
    description: 'Full upper body workout',
    category: 'workout',
    type: 'boolean',
    frequency: 'daily'
  },
  {
    name: 'Lower Body',
    description: 'Full lower body workout',
    category: 'workout',
    type: 'boolean',
    frequency: 'daily'
  },
  {
    name: 'Gym Session',
    description: 'Track total gym time',
    category: 'workout',
    type: 'duration',
    frequency: 'daily',
    target: 60,
    unit: 'minutes'
  },
  {
    name: 'Daily Exercise',
    description: 'Complete any workout or physical activity',
    category: 'workout',
    type: 'boolean',
    frequency: 'daily'
  },

  // Nutrition Habits
  {
    name: 'Healthy Eating',
    description: 'Eat healthy, balanced meals',
    category: 'nutrition',
    type: 'boolean',
    frequency: 'daily'
  },
  {
    name: 'Water Intake',
    description: 'Drink enough water throughout the day',
    category: 'nutrition',
    type: 'numeric',
    frequency: 'daily',
    target: 8,
    unit: 'glasses'
  },
  {
    name: 'Protein Goal',
    description: 'Hit daily protein target',
    category: 'nutrition',
    type: 'numeric',
    frequency: 'daily',
    target: 150,
    unit: 'grams'
  },
  {
    name: 'No Junk Food',
    description: 'Avoid processed/junk food today',
    category: 'nutrition',
    type: 'boolean',
    frequency: 'daily'
  },

  // Personal Habits
  {
    name: 'Work/Study Today',
    description: 'Complete productive work or study session',
    category: 'personal',
    type: 'boolean',
    frequency: 'daily',
    reminderTime: '09:00'
  },
  {
    name: 'Study Hours',
    description: 'Track daily study/work hours',
    category: 'personal',
    type: 'duration',
    frequency: 'daily',
    target: 4,
    unit: 'hours'
  },
  {
    name: '8 Hours Sleep',
    description: 'Get adequate sleep (7-8 hours)',
    category: 'personal',
    type: 'boolean',
    frequency: 'daily',
    reminderTime: '22:30'
  },
  {
    name: 'Reading',
    description: 'Read a book daily',
    category: 'personal',
    type: 'numeric',
    frequency: 'daily',
    target: 20,
    unit: 'pages'
  },
  {
    name: 'No Social Media',
    description: 'Avoid mindless scrolling today',
    category: 'personal',
    type: 'boolean',
    frequency: 'daily'
  },
  {
    name: 'Cold Shower',
    description: 'Take a cold shower for discipline',
    category: 'personal',
    type: 'boolean',
    frequency: 'daily',
    reminderTime: '06:30'
  }
];

export const SPIRITUAL_HABITS = HABIT_TEMPLATES.filter(h => h.category === 'spiritual');
export const WORKOUT_HABITS = HABIT_TEMPLATES.filter(h => h.category === 'workout');
export const NUTRITION_HABITS = HABIT_TEMPLATES.filter(h => h.category === 'nutrition');
export const PERSONAL_HABITS = HABIT_TEMPLATES.filter(h => h.category === 'personal');
