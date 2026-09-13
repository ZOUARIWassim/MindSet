import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOnboardingProgress } from "@/db/repositories/onboarding";
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

  return <AppShell userName={session.user.name ?? session.user.email ?? null}>{children}</AppShell>;
}
