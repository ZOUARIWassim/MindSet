"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { findHabitForUser, setHabitStatus, updateHabit, type UpdateHabitInput } from "@/db/repositories/habit";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

export async function editHabit(habitId: string, input: UpdateHabitInput): Promise<void> {
  const userId = await requireUserId();
  const habit = await findHabitForUser(habitId, userId);
  if (!habit) throw new Error("That habit doesn't belong to your account.");
  if (input.name !== undefined && !input.name.trim()) throw new Error("Give the habit a name.");
  if (input.behavior !== undefined && !input.behavior.trim()) throw new Error("Describe the behavior.");

  await updateHabit(habitId, input);
  revalidatePath(`/habits/${habitId}`);
}

export async function pauseHabit(habitId: string): Promise<void> {
  const userId = await requireUserId();
  const habit = await findHabitForUser(habitId, userId);
  if (!habit) throw new Error("That habit doesn't belong to your account.");

  await setHabitStatus(habitId, habit.status === "paused" ? "active" : "paused");
  revalidatePath(`/habits/${habitId}`);
}

export async function abandonHabit(habitId: string): Promise<void> {
  const userId = await requireUserId();
  const habit = await findHabitForUser(habitId, userId);
  if (!habit) throw new Error("That habit doesn't belong to your account.");

  await setHabitStatus(habitId, "abandoned");
  revalidatePath(`/habits/${habitId}`);
}
