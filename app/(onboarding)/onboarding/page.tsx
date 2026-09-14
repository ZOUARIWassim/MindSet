import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/db/client";
import { getOnboardingProgress } from "@/db/repositories/onboarding";
import { IDENTITY_PRESETS } from "@/lib/presets";
import { IdentitiesStep } from "@/components/onboarding/IdentitiesStep";
import { SystemStep } from "@/components/onboarding/SystemStep";
import { HabitsStep } from "@/components/onboarding/HabitsStep";
import { StepIndicator } from "@/components/onboarding/StepIndicator";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { step, identities } = await getOnboardingProgress(session.user.id);

  if (step === "complete") redirect("/today");

  if (step === "identities") {
    return (
      <>
        <StepIndicator current={1} />
        <IdentitiesStep presets={IDENTITY_PRESETS} />
      </>
    );
  }

  if (step === "system") {
    return (
      <>
        <StepIndicator current={2} />
        <SystemStep identities={identities.map((i) => ({ id: i.id, name: i.name }))} presets={IDENTITY_PRESETS} />
      </>
    );
  }

  const system = await prisma.habitSystem.findFirstOrThrow({
    where: { identity: { userId: session.user.id } },
    include: { identity: true },
  });

  return (
    <>
      <StepIndicator current={3} />
      <HabitsStep systemId={system.id} identityName={system.identity.name} presets={IDENTITY_PRESETS} />
    </>
  );
}
