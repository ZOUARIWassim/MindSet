"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { assembleUserContext } from "@/db/userContext";
import { generateInsights } from "@/domain/insights";
import { createInsights, dismissInsight } from "@/db/repositories/insight";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

export async function generateInsightsForCurrentUser(): Promise<void> {
  const userId = await requireUserId();
  const context = await assembleUserContext(userId);
  const drafts = generateInsights(context);
  await createInsights(userId, drafts);
  revalidatePath("/insights");
}

export async function dismissInsightAction(insightId: string): Promise<void> {
  const userId = await requireUserId();
  await dismissInsight(insightId, userId);
  revalidatePath("/insights");
}
