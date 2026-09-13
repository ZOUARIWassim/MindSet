import { prisma } from "../client";

export type OnboardingStep = "identities" | "system" | "habits" | "complete";

export async function getOnboardingProgress(userId: string) {
  const [identities, systemCount, habitCount] = await Promise.all([
    prisma.identity.findMany({
      where: { userId, archivedAt: null },
      orderBy: { order: "asc" },
    }),
    prisma.habitSystem.count({ where: { identity: { userId } } }),
    prisma.habit.count({ where: { system: { identity: { userId } } } }),
  ]);

  const step: OnboardingStep =
    identities.length === 0 ? "identities" : systemCount === 0 ? "system" : habitCount === 0 ? "habits" : "complete";

  return { identities, systemCount, habitCount, step };
}
