import { HabitCategory, HabitType, HabitFrequency } from '../models/Habit';

export interface HabitTemplate {
  name: string;
  description: string;
  category: HabitCategory;
  type: HabitType;
  frequency: HabitFrequency;
  target?: number;
  unit?: string;
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  // Spiritual Habits
  {
    name: 'Fajr Prayer',
    description: 'Complete Fajr (dawn) prayer on time',
    category: 'spiritual',
    type: 'boolean',
    frequency: 'daily'
  },
  {
    name: 'Dhuhr Prayer',
    description: 'Complete Dhuhr (noon) prayer on time',
    category: 'spiritual',
    type: 'boolean',
    frequency: 'daily'
  },
  {
    name: 'Asr Prayer',
    description: 'Complete Asr (afternoon) prayer on time',
    category: 'spiritual',
    type: 'boolean',
    frequency: 'daily'
  },
  {
    name: 'Maghrib Prayer',
    description: 'Complete Maghrib (sunset) prayer on time',
    category: 'spiritual',
    type: 'boolean',
    frequency: 'daily'
  },
  {
    name: 'Isha Prayer',
    description: 'Complete Isha (night) prayer on time',
    category: 'spiritual',
    type: 'boolean',
    frequency: 'daily'
  },
  {
    name: 'Quran Reading',
    description: 'Read Quran daily',
    category: 'spiritual',
    type: 'numeric',
    frequency: 'daily',
    target: 2,
    unit: 'pages'
  },

  // Personal Habits
  {
    name: 'Work/Study Today',
    description: 'Complete productive work or study session',
    category: 'personal',
    type: 'boolean',
    frequency: 'daily'
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

  // Workout Habits
  {
    name: 'Daily Exercise',
    description: 'Complete workout or physical activity',
    category: 'workout',
    type: 'boolean',
    frequency: 'daily'
  },
  {
    name: 'Workout Duration',
    description: 'Track exercise time',
    category: 'workout',
    type: 'duration',
    frequency: 'daily',
    target: 30,
    unit: 'minutes'
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

  // Sleep Habit
  {
    name: '8 Hours Sleep',
    description: 'Get adequate sleep (7-8 hours)',
    category: 'personal',
    type: 'boolean',
    frequency: 'daily'
  }
];

export const SPIRITUAL_HABITS = HABIT_TEMPLATES.filter(h => h.category === 'spiritual');
export const WORKOUT_HABITS = HABIT_TEMPLATES.filter(h => h.category === 'workout');
export const NUTRITION_HABITS = HABIT_TEMPLATES.filter(h => h.category === 'nutrition');
export const PERSONAL_HABITS = HABIT_TEMPLATES.filter(h => h.category === 'personal');
