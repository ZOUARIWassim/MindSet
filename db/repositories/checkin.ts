import { prisma } from "../client";
import type { HabitEntryStatus } from "../../generated/prisma/client";

export function getCheckInForDate(userId: string, date: Date) {
  return prisma.checkIn.findUnique({
    where: { userId_date: { userId, date } },
    include: { entries: true },
  });
}

export interface CheckInMetaInput {
  energy: number;
  mood: number;
  stress: number;
  focus: number;
  note?: string;
}

export function upsertCheckInMeta(userId: string, date: Date, input: CheckInMetaInput) {
  return prisma.checkIn.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, ...input },
    update: input,
  });
}

async function getOrCreateCheckIn(userId: string, date: Date) {
  return prisma.checkIn.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, energy: 3, mood: 3, stress: 3, focus: 3 },
    update: {},
  });
}

export interface HabitEntryInput {
  status: HabitEntryStatus;
  value?: number;
  unit?: string;
  note?: string;
  performedAt?: Date;
}

export async function upsertHabitEntry(userId: string, date: Date, habitId: string, input: HabitEntryInput) {
  const checkIn = await getOrCreateCheckIn(userId, date);
  return prisma.habitEntry.upsert({
    where: { checkInId_habitId: { checkInId: checkIn.id, habitId } },
    create: { checkInId: checkIn.id, habitId, ...input },
    update: input,
  });
}

/** Non-missed, non-skipped entry counts per habit for the calendar week containing `date`. */
export async function weekEntryCountsForUser(
  userId: string,
  weekStart: Date,
  weekEnd: Date,
): Promise<Map<string, number>> {
  const entries = await prisma.habitEntry.findMany({
    where: {
      checkIn: { userId, date: { gte: weekStart, lte: weekEnd } },
      status: { in: ["completed", "minimum", "partial"] },
    },
    select: { habitId: true },
  });
  const counts = new Map<string, number>();
  for (const entry of entries) {
    counts.set(entry.habitId, (counts.get(entry.habitId) ?? 0) + 1);
  }
  return counts;
}
