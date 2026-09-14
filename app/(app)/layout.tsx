import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOnboardingProgress } from "@/db/repositories/onboarding";
import { listIdentitiesForUser } from "@/db/repositories/identity";
import { AppShell } from "@/components/layout/AppShell";

export default async function AppRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { step } = await getOnboardingProgress(session.user.id);
  if (step !== "complete") redirect("/onboarding");

  const identities = await listIdentitiesForUser(session.user.id);

  return (
    <AppShell
      userName={session.user.name ?? session.user.email ?? null}
      identities={identities.map((identity) => ({ id: identity.id, name: identity.name }))}
    >
      {children}
    </AppShell>
  );
}
