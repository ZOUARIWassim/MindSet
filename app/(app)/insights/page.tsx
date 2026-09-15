import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { assembleUserContext } from "@/db/userContext";
import { listActiveInsightsForUser } from "@/db/repositories/insight";
import { daysUntilInsightsAvailable } from "@/domain/insights";
import { InsightCard } from "@/components/insights/InsightCard";
import { InsightGate } from "@/components/insights/InsightGate";
import { GenerateInsightsButton } from "@/components/insights/GenerateInsightsButton";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function InsightsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const context = await assembleUserContext(session.user.id);
  const insights = await listActiveInsightsForUser(session.user.id);
  const pending = daysUntilInsightsAvailable(context).filter((entry) => entry.daysRemaining > 0);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Insights</h1>
          <p className="text-sm text-text-secondary">What your system is telling you.</p>
        </div>
        <GenerateInsightsButton />
      </div>

      {insights.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No insights yet"
          description="Once there's enough data, patterns worth knowing about will show up here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {insights.map((insight) => (
            <InsightCard
              key={insight.id}
              id={insight.id}
              kind={insight.kind}
              title={insight.title}
              body={insight.body}
              evidence={insight.evidence as Record<string, unknown>}
            />
          ))}
        </div>
      )}

      <InsightGate pending={pending} />
    </div>
  );
}
