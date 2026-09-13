import type { FrequencyRule } from "@/domain/scheduling";

export interface HabitPreset {
  name: string;
  behavior: string;
  frequency: FrequencyRule;
  targetValue?: number;
  minimumValue?: number;
  unit?: string;
  preferredTime?: string;
  contextLocation?: string;
  contextTrigger?: string;
  difficulty: number;
  reason?: string;
}

export interface IdentityPreset {
  key: string;
  name: string;
  statement: string;
  description: string;
  goal: {
    name: string;
    unit?: string;
    targetValue?: number;
    importance: "low" | "medium" | "high";
  };
  system: {
    name: string;
    description?: string;
  };
  habits: HabitPreset[];
}

export const IDENTITY_PRESETS: IdentityPreset[] = [
  {
    key: "athlete",
    name: "Athlete",
    statement: "I am someone who trains consistently and takes care of my body.",
    description: "Building the habits behind a strong, resilient body.",
    goal: { name: "Run a 5K under 25 minutes", unit: "minutes", targetValue: 25, importance: "high" },
    system: { name: "Morning Training System", description: "The system behind race-day readiness." },
    habits: [
      {
        name: "Morning Run",
        behavior: "Run outdoors or on the treadmill",
        frequency: { type: "daily" },
        targetValue: 30,
        minimumValue: 10,
        unit: "minutes",
        preferredTime: "08:00",
        contextLocation: "outside",
        contextTrigger: "after waking up",
        difficulty: 3,
        reason: "Building the endurance behind the 5K goal.",
      },
      {
        name: "Strength Session",
        behavior: "Strength training session",
        frequency: { type: "n_per_week", n: 3 },
        targetValue: 45,
        minimumValue: 15,
        unit: "minutes",
        preferredTime: "18:00",
        contextLocation: "gym",
        difficulty: 4,
        reason: "Building the strength to support the running.",
      },
    ],
  },
  {
    key: "reader",
    name: "Reader",
    statement: "I am someone who reads consistently and keeps learning.",
    description: "A little reading every day, no pressure to finish fast.",
    goal: { name: "Finish 12 books this year", unit: "books", targetValue: 12, importance: "medium" },
    system: { name: "Daily Reading System" },
    habits: [
      {
        name: "Read Before Bed",
        behavior: "Read a physical book",
        frequency: { type: "daily" },
        targetValue: 20,
        minimumValue: 2,
        unit: "pages",
        preferredTime: "21:00",
        contextTrigger: "after brushing teeth",
        difficulty: 2,
        reason: "Growing a reading habit, one page at a time.",
      },
    ],
  },
  {
    key: "grounded",
    name: "Grounded",
    statement: "I am someone who stays present and takes care of my mind.",
    description: "Small daily practices that keep stress from piling up.",
    goal: { name: "Feel less reactive to stress", importance: "medium" },
    system: { name: "Mindfulness System" },
    habits: [
      {
        name: "Meditate",
        behavior: "Sit quietly and breathe",
        frequency: { type: "n_per_week", n: 3 },
        targetValue: 10,
        minimumValue: 3,
        unit: "minutes",
        preferredTime: "07:00",
        difficulty: 2,
        reason: "Reducing stress before the day gets going.",
      },
      {
        name: "Gratitude Journal",
        behavior: "Write down three things I'm grateful for",
        frequency: { type: "n_per_week", n: 4 },
        targetValue: 3,
        minimumValue: 1,
        unit: "entries",
        preferredTime: "21:30",
        difficulty: 1,
        reason: "Noticing the good, not just the grind.",
      },
    ],
  },
];
