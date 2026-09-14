import { prisma } from "../client";
import { localDateToUtcMidnight } from "../../lib/timezone";
import type { InsightDraft } from "../../domain/insights";
import type { Prisma } from "../../generated/prisma/client";

export function listActiveInsightsForUser(userId: string) {
  return prisma.insight.findMany({
    where: { userId, dismissedAt: null },
    orderBy: { createdAt: "desc" },
  });
}

export async function createInsights(userId: string, drafts: InsightDraft[]) {
  if (drafts.length === 0) return;
  await prisma.insight.createMany({
    data: drafts.map((draft) => ({
      userId,
      kind: draft.kind,
      title: draft.title,
      body: draft.body,
      evidence: draft.evidence as Prisma.InputJsonValue,
      periodStart: localDateToUtcMidnight(draft.periodStart),
      periodEnd: localDateToUtcMidnight(draft.periodEnd),
    })),
  });
}

export function dismissInsight(insightId: string, userId: string) {
  return prisma.insight.updateMany({
    where: { id: insightId, userId },
    data: { dismissedAt: new Date() },
  });
}
