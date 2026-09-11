import type { HabitEntryStatus } from "../generated/prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../db/client";

const DEMO_EMAIL = "demo@mindset.local";
const DEMO_PASSWORD = "mindset-demo";
const DAYS = 90;

// Deterministic PRNG (mulberry32) so re-seeding produces the same demo data.
function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const random = mulberry32(20260911);

function dateAt(daysAgo: number, hour: number, minute: number): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(hour, minute, 0, 0);
  return d;
}

function calendarDate(daysAgo: number): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d;
}

function pick<T>(items: T[]): T {
  return items[Math.floor(random() * items.length)];
}

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (existing) {
    await prisma.user.delete({ where: { id: existing.id } });
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const user = await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      passwordHash,
      name: "Demo User",
      timezone: "UTC",
    },
  });

  const athlete = await prisma.identity.create({
    data: {
      userId: user.id,
      name: "Athlete",
      statement: "I am someone who trains consistently and takes care of my body.",
      description: "Building the habits behind a strong, resilient body.",
      order: 0,
    },
  });
  const athleteGoal = await prisma.goal.create({
    data: {
      identityId: athlete.id,
      name: "Run a 5K under 25 minutes",
      description: "Steady progress through consistent morning runs.",
      targetValue: 25,
      currentValue: 29,
      unit: "minutes",
      deadline: dateAt(-60, 0, 0),
      importance: "high",
      status: "active",
    },
  });
  const trainingSystem = await prisma.habitSystem.create({
    data: {
      identityId: athlete.id,
      goalId: athleteGoal.id,
      name: "Morning Training System",
      description: "The system behind race-day readiness.",
      order: 0,
    },
  });
  const morningRun = await prisma.habit.create({
    data: {
      systemId: trainingSystem.id,
      goalId: athleteGoal.id,
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
      status: "active",
      createdAt: dateAt(DAYS, 8, 0),
    },
  });
  const lateWorkout = await prisma.habit.create({
    data: {
      systemId: trainingSystem.id,
      name: "Strength Session",
      behavior: "Strength training session",
      frequency: { type: "daily" },
      targetValue: 45,
      minimumValue: 15,
      unit: "minutes",
      preferredTime: "22:00",
      contextLocation: "home gym",
      contextTrigger: "after dinner",
      difficulty: 4,
      reason: "Building strength to support the running.",
      status: "active",
      createdAt: dateAt(DAYS, 22, 0),
    },
  });

  const reader = await prisma.identity.create({
    data: {
      userId: user.id,
      name: "Reader",
      statement: "I am someone who reads consistently and keeps learning.",
      description: "A little reading every day, no pressure to finish fast.",
      order: 1,
    },
  });
  const readerGoal = await prisma.goal.create({
    data: {
      identityId: reader.id,
      name: "Finish 12 books this year",
      targetValue: 12,
      currentValue: 5,
      unit: "books",
      deadline: dateAt(-180, 0, 0),
      importance: "medium",
      status: "active",
    },
  });
  const readingSystem = await prisma.habitSystem.create({
    data: {
      identityId: reader.id,
      goalId: readerGoal.id,
      name: "Daily Reading System",
      order: 0,
    },
  });
  const reading = await prisma.habit.create({
    data: {
      systemId: readingSystem.id,
      goalId: readerGoal.id,
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
      status: "active",
      createdAt: dateAt(DAYS, 21, 0),
    },
  });

  const grounded = await prisma.identity.create({
    data: {
      userId: user.id,
      name: "Grounded",
      statement: "I am someone who stays present and takes care of my mind.",
      order: 2,
    },
  });
  const mindfulnessSystem = await prisma.habitSystem.create({
    data: {
      identityId: grounded.id,
      name: "Mindfulness System",
      order: 0,
    },
  });
  const meditate = await prisma.habit.create({
    data: {
      systemId: mindfulnessSystem.id,
      name: "Meditate",
      behavior: "Sit quietly and breathe",
      frequency: { type: "n_per_week", n: 3 },
      targetValue: 10,
      minimumValue: 3,
      unit: "minutes",
      preferredTime: "07:00",
      difficulty: 2,
      reason: "Reducing stress between training and reading.",
      status: "active",
      createdAt: dateAt(DAYS, 7, 0),
    },
  });
  const gratitude = await prisma.habit.create({
    data: {
      systemId: mindfulnessSystem.id,
      name: "Gratitude Journal",
      behavior: "Write down three things I'm grateful for",
      frequency: { type: "n_per_week", n: 4 },
      targetValue: 3,
      minimumValue: 1,
      unit: "entries",
      preferredTime: "21:30",
      difficulty: 1,
      reason: "Noticing the good, not just the grind.",
      status: "active",
      createdAt: dateAt(DAYS, 21, 30),
    },
  });

  let checkInCount = 0;
  let entryCount = 0;
  let meditateThisWeek = 0;
  let gratitudeThisWeek = 0;

  for (let daysAgo = DAYS - 1; daysAgo >= 0; daysAgo--) {
    if (daysAgo % 7 === 6) {
      meditateThisWeek = 0;
      gratitudeThisWeek = 0;
    }

    // A handful of days with no check-in at all, as real usage has gaps.
    if (random() < 0.06) continue;

    const isTravelDay = random() < 0.05;
    const context = isTravelDay
      ? { travel: true }
      : random() < 0.08
        ? { workload: true }
        : undefined;

    const checkIn = await prisma.checkIn.create({
      data: {
        userId: user.id,
        date: calendarDate(daysAgo),
        energy: 2 + Math.floor(random() * 4),
        mood: 2 + Math.floor(random() * 4),
        stress: isTravelDay ? 4 : 1 + Math.floor(random() * 4),
        focus: 2 + Math.floor(random() * 4),
        note: random() < 0.15 ? pick([
          "Felt good today.",
          "Tired but pushed through.",
          "Rough day at work.",
          "Great energy this morning.",
        ]) : undefined,
        context,
      },
    });
    checkInCount++;

    // Morning Run: strong at 08:00, ~85% completed/minimum.
    {
      const roll = random();
      const status: HabitEntryStatus = isTravelDay
        ? "skipped_intentionally"
        : roll < 0.7
          ? "completed"
          : roll < 0.85
            ? "minimum"
            : roll < 0.95
              ? "partial"
              : "missed";
      await prisma.habitEntry.create({
        data: {
          checkInId: checkIn.id,
          habitId: morningRun.id,
          status,
          value: status === "completed" ? 25 + Math.round(random() * 15)
            : status === "minimum" ? 10
            : status === "partial" ? 15
            : null,
          unit: "minutes",
          performedAt: status === "missed" || status === "skipped_intentionally"
            ? null
            : dateAt(daysAgo, 8, Math.floor(random() * 30)),
        },
      });
      entryCount++;
    }

    // Strength Session: weak at 22:00, ~25% completed/minimum.
    {
      const roll = random();
      const status: HabitEntryStatus = isTravelDay
        ? "skipped_intentionally"
        : roll < 0.15
          ? "completed"
          : roll < 0.25
            ? "minimum"
            : roll < 0.35
              ? "partial"
              : "missed";
      await prisma.habitEntry.create({
        data: {
          checkInId: checkIn.id,
          habitId: lateWorkout.id,
          status,
          value: status === "completed" ? 40 + Math.round(random() * 15)
            : status === "minimum" ? 15
            : status === "partial" ? 20
            : null,
          unit: "minutes",
          performedAt: status === "missed" || status === "skipped_intentionally"
            ? null
            : dateAt(daysAgo, 22, Math.floor(random() * 45)),
        },
      });
      entryCount++;
    }

    // Read Before Bed: moderate, with heavy minimum-version reliance.
    {
      const roll = random();
      const status: HabitEntryStatus = isTravelDay && random() < 0.5
        ? "skipped_intentionally"
        : roll < 0.35
          ? "completed"
          : roll < 0.7
            ? "minimum"
            : roll < 0.85
              ? "partial"
              : roll < 0.95
                ? "missed"
                : "skipped_intentionally";
      await prisma.habitEntry.create({
        data: {
          checkInId: checkIn.id,
          habitId: reading.id,
          status,
          value: status === "completed" ? 15 + Math.round(random() * 20)
            : status === "minimum" ? 2
            : status === "partial" ? 8
            : null,
          unit: "pages",
          performedAt: status === "missed" || status === "skipped_intentionally"
            ? null
            : dateAt(daysAgo, 21, Math.floor(random() * 30)),
        },
      });
      entryCount++;
    }

    // Meditate: n_per_week = 3, only logged on days it happens.
    if (meditateThisWeek < 3 && random() < 0.5) {
      const status: HabitEntryStatus = random() < 0.8 ? "completed" : "minimum";
      await prisma.habitEntry.create({
        data: {
          checkInId: checkIn.id,
          habitId: meditate.id,
          status,
          value: status === "completed" ? 10 : 3,
          unit: "minutes",
          performedAt: dateAt(daysAgo, 7, Math.floor(random() * 20)),
        },
      });
      entryCount++;
      meditateThisWeek++;
    }

    // Gratitude Journal: n_per_week = 4, only logged on days it happens.
    if (gratitudeThisWeek < 4 && random() < 0.6) {
      const status: HabitEntryStatus = random() < 0.85 ? "completed" : "minimum";
      await prisma.habitEntry.create({
        data: {
          checkInId: checkIn.id,
          habitId: gratitude.id,
          status,
          value: status === "completed" ? 3 : 1,
          unit: "entries",
          performedAt: dateAt(daysAgo, 21, 30 + Math.floor(random() * 20)),
        },
      });
      entryCount++;
      gratitudeThisWeek++;
    }
  }

  console.log(`Seeded demo user ${DEMO_EMAIL} (password: ${DEMO_PASSWORD})`);
  console.log(`  3 identities, 2 goals, 3 systems, 5 habits`);
  console.log(`  ${checkInCount} check-ins, ${entryCount} habit entries over ${DAYS} days`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
