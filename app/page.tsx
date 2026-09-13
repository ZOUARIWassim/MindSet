import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOnboardingProgress } from "@/db/repositories/onboarding";

export default async function RootPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { step } = await getOnboardingProgress(session.user.id);
  redirect(step === "complete" ? "/today" : "/onboarding");
}
