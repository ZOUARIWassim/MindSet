import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/db/client";
import { assembleUserContext } from "@/db/userContext";
import { generateInsights } from "@/domain/insights";
import { createInsights } from "@/db/repositories/insight";

/**
 * Nightly insight generation, triggered by Vercel Cron (see vercel.json).
 * Runs the same generateInsights() the on-demand action uses, for every
 * user, so insights are usually already waiting when someone opens the
 * Insights page.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const users = await prisma.user.findMany({ select: { id: true } });

  let totalGenerated = 0;
  for (const { id: userId } of users) {
    const context = await assembleUserContext(userId);
    const drafts = generateInsights(context);
    await createInsights(userId, drafts);
    totalGenerated += drafts.length;
  }

  return NextResponse.json({ usersProcessed: users.length, insightsGenerated: totalGenerated });
}
