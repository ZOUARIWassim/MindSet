"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { submitSystemStep } from "@/app/actions/onboarding";
import type { IdentityPreset } from "@/lib/presets";

interface IdentityOption {
  id: string;
  name: string;
}

export function SystemStep({
  identities,
  presets,
}: {
  identities: IdentityOption[];
  presets: IdentityPreset[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [identityId, setIdentityId] = useState(identities[0]?.id ?? "");

  const suggestion = useMemo(() => {
    const identity = identities.find((i) => i.id === identityId);
    const preset = presets.find((p) => p.name === identity?.name);
    return preset?.system ?? { name: identity ? `${identity.name} System` : "", description: undefined };
  }, [identityId, identities, presets]);

  const [name, setName] = useState(suggestion.name);
  const [description, setDescription] = useState(suggestion.description ?? "");
  const [hasEditedName, setHasEditedName] = useState(false);

  function handleIdentityChange(nextId: string) {
    setIdentityId(nextId);
    if (!hasEditedName) {
      const identity = identities.find((i) => i.id === nextId);
      const preset = presets.find((p) => p.name === identity?.name);
      setName(preset?.system.name ?? (identity ? `${identity.name} System` : ""));
      setDescription(preset?.system.description ?? "");
    }
  }

  function handleContinue() {
    if (!name.trim()) {
      toast.error("Give your system a name.");
      return;
    }
    startTransition(async () => {
      try {
        await submitSystemStep({ identityId, name, description: description || undefined });
        router.refresh();
      } catch {
        toast.error("Something went wrong saving that. Try again.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Design your first system</h1>
        <p className="mt-1 text-sm text-text-secondary">
          A system is the container for the habits behind an identity. You can add more systems later.
        </p>
      </div>

      {identities.length > 1 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">For which identity?</label>
          <Select
            value={identityId}
            onValueChange={handleIdentityChange}
            options={identities.map((i) => ({ value: i.id, label: i.name }))}
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="system-name" className="text-sm font-medium text-text-secondary">
          System name
        </label>
        <input
          id="system-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setHasEditedName(true);
          }}
          className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="system-description" className="text-sm font-medium text-text-secondary">
          Description (optional)
        </label>
        <textarea
          id="system-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
      </div>

      <Button onClick={handleContinue} isLoading={isPending} size="lg" className="self-start">
        Continue
      </Button>
    </div>
  );
}
