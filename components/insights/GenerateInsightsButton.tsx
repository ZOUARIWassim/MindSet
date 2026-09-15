"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { generateInsightsForCurrentUser } from "@/app/actions/insight";

export function GenerateInsightsButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await generateInsightsForCurrentUser();
      router.refresh();
    });
  }

  return (
    <Button variant="secondary" onClick={handleClick} isLoading={isPending}>
      Check for new insights
    </Button>
  );
}
