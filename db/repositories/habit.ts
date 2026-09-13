import { prisma } from "../client";
import type { FrequencyRule } from "../../domain/scheduling";

export function countHabitsForUser(userId: string) {
  return prisma.habit.count({ where: { system: { identity: { userId } } } });
}

export function listActiveHabitsForUser(userId: string) {
  return prisma.habit.findMany({
    where: { system: { identity: { userId } }, status: "active" },
    include: { system: { include: { identity: true } } },
  });
}

export interface CreateHabitInput {
  systemId: string;
  goalId?: string;
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

export function createHabit(input: CreateHabitInput) {
  return prisma.habit.create({
    data: {
      systemId: input.systemId,
      goalId: input.goalId,
      name: input.name,
      behavior: input.behavior,
      frequency: input.frequency,
      targetValue: input.targetValue,
      minimumValue: input.minimumValue,
      unit: input.unit,
      preferredTime: input.preferredTime,
      contextLocation: input.contextLocation,
      contextTrigger: input.contextTrigger,
      difficulty: input.difficulty,
      reason: input.reason,
      status: "active",
    },
  });
}
