"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { createIdentityWithGoal, findIdentityForUser } from "@/db/repositories/identity";
import { createHabitSystem, findSystemForUser } from "@/db/repositories/habitSystem";
import { createHabit } from "@/db/repositories/habit";
import type { FrequencyRule } from "@/domain/scheduling";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

export interface IdentitySubmission {
  name: string;
  statement: string;
  description?: string;
  goal?: {
    name: string;
    unit?: string;
    targetValue?: number;
    importance?: "low" | "medium" | "high";
  };
}

export async function submitIdentitiesStep(identities: IdentitySubmission[]): Promise<void> {
  const userId = await requireUserId();
  const valid = identities.filter((input) => input.name.trim() && input.statement.trim());
  if (valid.length === 0 || valid.length > 3) {
    throw new Error("Choose between 1 and 3 identities.");
  }

  for (const [order, input] of valid.entries()) {
    await createIdentityWithGoal({
      userId,
      name: input.name.trim(),
      statement: input.statement.trim(),
      description: input.description?.trim() || undefined,
      order,
      goal: input.goal?.name
        ? {
            name: input.goal.name,
            unit: input.goal.unit,
            targetValue: input.goal.targetValue,
            importance: input.goal.importance,
          }
        : undefined,
    });
  }
}

export interface SystemSubmission {
  identityId: string;
  name: string;
  description?: string;
}

export async function submitSystemStep(input: SystemSubmission): Promise<void> {
  const userId = await requireUserId();
  const identity = await findIdentityForUser(input.identityId, userId);
  if (!identity) throw new Error("That identity doesn't belong to your account.");
  if (!input.name.trim()) throw new Error("Give your system a name.");

  await createHabitSystem({
    identityId: identity.id,
    name: input.name.trim(),
    description: input.description?.trim() || undefined,
  });
}

export interface HabitSubmission {
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

export async function submitHabitsStep(systemId: string, habits: HabitSubmission[]): Promise<void> {
  const userId = await requireUserId();
  const system = await findSystemForUser(systemId, userId);
  if (!system) throw new Error("That system doesn't belong to your account.");

  const valid = habits.filter((h) => h.name.trim() && h.behavior.trim());
  if (valid.length === 0 || valid.length > 3) {
    throw new Error("Add between 1 and 3 habits.");
  }

  for (const habit of valid) {
    await createHabit({
      systemId: system.id,
      name: habit.name.trim(),
      behavior: habit.behavior.trim(),
      frequency: habit.frequency,
      targetValue: habit.targetValue,
      minimumValue: habit.minimumValue,
      unit: habit.unit,
      preferredTime: habit.preferredTime,
      contextLocation: habit.contextLocation,
      contextTrigger: habit.contextTrigger,
      difficulty: habit.difficulty,
      reason: habit.reason,
    });
  }

  redirect("/today");
}
