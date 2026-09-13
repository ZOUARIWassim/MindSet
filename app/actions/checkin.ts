"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/db/client";
import { upsertCheckInMeta, upsertHabitEntry, type CheckInMetaInput, type HabitEntryInput } from "@/db/repositories/checkin";
import { localDateToUtcMidnight, todayLocal } from "@/lib/timezone";
import { addDaysLocal, compareLocalDate, type LocalDate } from "@/domain/timezone";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
  return user;
}

/** The check-in flow only allows editing today and the 6 days before it. */
function assertEditableDate(date: LocalDate, timezone: string) {
  const today = todayLocal(timezone);
  const earliest = addDaysLocal(today, -6);
  if (compareLocalDate(date, earliest) < 0 || compareLocalDate(date, today) > 0) {
    throw new Error("That day is outside the editable window.");
  }
}

export async function saveCheckInMeta(date: LocalDate, input: CheckInMetaInput): Promise<void> {
  const user = await requireUser();
  assertEditableDate(date, user.timezone);

  for (const field of [input.energy, input.mood, input.stress, input.focus]) {
    if (!Number.isInteger(field) || field < 1 || field > 5) {
      throw new Error("Energy, mood, stress, and focus must be whole numbers from 1 to 5.");
    }
  }

  await upsertCheckInMeta(user.id, localDateToUtcMidnight(date), input);
}

export async function saveHabitEntry(date: LocalDate, habitId: string, input: HabitEntryInput): Promise<void> {
  const user = await requireUser();
  assertEditableDate(date, user.timezone);

  const habit = await prisma.habit.findFirst({ where: { id: habitId, system: { identity: { userId: user.id } } } });
  if (!habit) throw new Error("That habit doesn't belong to your account.");

  await upsertHabitEntry(user.id, localDateToUtcMidnight(date), habitId, input);
}
