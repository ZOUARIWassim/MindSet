"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { submitIdentitiesStep, type IdentitySubmission } from "@/app/actions/onboarding";
import type { IdentityPreset } from "@/lib/presets";

interface CustomIdentity {
  name: string;
  statement: string;
}

const MAX_IDENTITIES = 3;

export function IdentitiesStep({ presets }: { presets: IdentityPreset[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [goalIncluded, setGoalIncluded] = useState<Record<string, boolean>>({});
  const [customIdentities, setCustomIdentities] = useState<CustomIdentity[]>([]);

  const totalCount = selectedKeys.length + customIdentities.length;
  const canAddMore = totalCount < MAX_IDENTITIES;

  function togglePreset(key: string) {
    setSelectedKeys((current) => {
      if (current.includes(key)) return current.filter((k) => k !== key);
      if (!canAddMore) return current;
      return [...current, key];
    });
    setGoalIncluded((current) => ({ ...current, [key]: current[key] ?? true }));
  }

  function addCustomIdentity() {
    if (!canAddMore) return;
    setCustomIdentities((current) => [...current, { name: "", statement: "" }]);
  }

  function updateCustomIdentity(index: number, field: keyof CustomIdentity, value: string) {
    setCustomIdentities((current) =>
      current.map((identity, i) => (i === index ? { ...identity, [field]: value } : identity)),
    );
  }

  function removeCustomIdentity(index: number) {
    setCustomIdentities((current) => current.filter((_, i) => i !== index));
  }

  function handleContinue() {
    setError(null);
    const fromPresets: IdentitySubmission[] = selectedKeys.map((key) => {
      const preset = presets.find((p) => p.key === key)!;
      return {
        name: preset.name,
        statement: preset.statement,
        description: preset.description,
        goal: goalIncluded[key] ? preset.goal : undefined,
      };
    });
    const fromCustom: IdentitySubmission[] = customIdentities
      .filter((identity) => identity.name.trim() && identity.statement.trim())
      .map((identity) => ({ name: identity.name, statement: identity.statement }));

    const submissions = [...fromPresets, ...fromCustom];
    if (submissions.length === 0) {
      setError("Choose or write at least one identity.");
      return;
    }

    startTransition(async () => {
      try {
        await submitIdentitiesStep(submissions);
        router.refresh();
      } catch {
        setError("Something went wrong saving that. Try again.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Who do you want to become?</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Pick 1-3 identities to start with, or write your own. You can always add more later.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {presets.map((preset) => {
          const isSelected = selectedKeys.includes(preset.key);
          return (
            <Card key={preset.key} className={isSelected ? "border-accent" : undefined}>
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`preset-${preset.key}`}
                  checked={isSelected}
                  onCheckedChange={() => togglePreset(preset.key)}
                  className="mt-0.5"
                />
                <label htmlFor={`preset-${preset.key}`} className="flex-1 cursor-pointer">
                  <p className="font-medium text-text-primary">{preset.name}</p>
                  <p className="text-sm text-text-secondary">{preset.statement}</p>
                </label>
              </div>
              {isSelected && (
                <div className="mt-3 flex items-center gap-2 pl-8">
                  <Checkbox
                    id={`goal-${preset.key}`}
                    checked={goalIncluded[preset.key] ?? true}
                    onCheckedChange={(checked) =>
                      setGoalIncluded((current) => ({ ...current, [preset.key]: checked }))
                    }
                  />
                  <label htmlFor={`goal-${preset.key}`} className="text-sm text-text-secondary">
                    Also set the goal: {preset.goal.name}
                  </label>
                </div>
              )}
            </Card>
          );
        })}

        {customIdentities.map((identity, index) => (
          <Card key={index}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">Your own identity</span>
                <button
                  type="button"
                  onClick={() => removeCustomIdentity(index)}
                  className="text-xs text-text-muted hover:text-red-500"
                >
                  Remove
                </button>
              </div>
              <input
                value={identity.name}
                onChange={(e) => updateCustomIdentity(index, "name", e.target.value)}
                placeholder="e.g. Early Riser"
                aria-label="Identity name"
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
              />
              <input
                value={identity.statement}
                onChange={(e) => updateCustomIdentity(index, "statement", e.target.value)}
                placeholder="I am someone who..."
                aria-label="Identity statement"
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
          </Card>
        ))}

        {canAddMore && (
          <button
            type="button"
            onClick={addCustomIdentity}
            className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-text-secondary hover:border-accent hover:text-accent"
          >
            + Write your own identity
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button onClick={handleContinue} disabled={isPending} className="self-start">
        {isPending ? "Saving..." : "Continue"}
      </Button>
    </div>
  );
}
