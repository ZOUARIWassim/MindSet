"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Collapsible } from "@/components/ui/Collapsible";
import { cn } from "@/lib/cn";
import { submitHabitsStep, type HabitSubmission } from "@/app/actions/onboarding";
import type { HabitPreset, IdentityPreset } from "@/lib/presets";

interface HabitRow {
  name: string;
  behavior: string;
  frequencyType: "daily" | "n_per_week";
  n: number;
  targetValue: string;
  minimumValue: string;
  unit: string;
  preferredTime: string;
  contextTrigger: string;
  difficulty: number;
  reason: string;
}

const MAX_HABITS = 3;
const inputClasses =
  "rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-accent";

function blankRow(): HabitRow {
  return {
    name: "",
    behavior: "",
    frequencyType: "daily",
    n: 3,
    targetValue: "",
    minimumValue: "",
    unit: "",
    preferredTime: "",
    contextTrigger: "",
    difficulty: 3,
    reason: "",
  };
}

function rowFromPreset(preset: HabitPreset): HabitRow {
  return {
    name: preset.name,
    behavior: preset.behavior,
    frequencyType: preset.frequency.type === "n_per_week" ? "n_per_week" : "daily",
    n: preset.frequency.type === "n_per_week" ? preset.frequency.n : 3,
    targetValue: preset.targetValue?.toString() ?? "",
    minimumValue: preset.minimumValue?.toString() ?? "",
    unit: preset.unit ?? "",
    preferredTime: preset.preferredTime ?? "",
    contextTrigger: preset.contextTrigger ?? "",
    difficulty: preset.difficulty,
    reason: preset.reason ?? "",
  };
}

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Every day" },
  { value: "n_per_week", label: "A few times a week" },
];

export function HabitsStep({
  systemId,
  identityName,
  presets,
}: {
  systemId: string;
  identityName: string;
  presets: IdentityPreset[];
}) {
  const [isPending, startTransition] = useTransition();

  const suggested = presets.find((p) => p.name === identityName)?.habits ?? [];
  const [rows, setRows] = useState<HabitRow[]>(
    suggested.length > 0 ? suggested.slice(0, MAX_HABITS).map(rowFromPreset) : [blankRow()],
  );

  function updateRow(index: number, patch: Partial<HabitRow>) {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addRow() {
    if (rows.length >= MAX_HABITS) return;
    setRows((current) => [...current, blankRow()]);
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, i) => i !== index));
  }

  function handleContinue() {
    const valid = rows.filter((row) => row.name.trim() && row.behavior.trim());
    if (valid.length === 0) {
      toast.error("Add at least one habit.");
      return;
    }
    for (const row of valid) {
      if (!row.minimumValue.trim()) {
        toast.error(`Give "${row.name}" a minimum version - the smallest version that still counts.`);
        return;
      }
    }

    const submissions: HabitSubmission[] = valid.map((row) => ({
      name: row.name,
      behavior: row.behavior,
      frequency:
        row.frequencyType === "n_per_week" ? { type: "n_per_week", n: row.n } : { type: "daily" },
      targetValue: row.targetValue ? Number(row.targetValue) : undefined,
      minimumValue: Number(row.minimumValue),
      unit: row.unit || undefined,
      preferredTime: row.preferredTime || undefined,
      contextTrigger: row.contextTrigger || undefined,
      difficulty: row.difficulty,
      reason: row.reason || undefined,
    }));

    startTransition(async () => {
      try {
        await submitHabitsStep(systemId, submissions);
      } catch {
        toast.error("Something went wrong saving that. Try again.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Add your first habits</h1>
        <p className="mt-1 text-sm text-text-secondary">
          1-3 habits to start. The name, behavior, and minimum version are all you need - everything
          else is optional detail you can add now or skip.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {rows.map((row, index) => (
          <Card key={index} padding="sm" className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">Habit {index + 1}</span>
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="text-xs text-text-muted hover:text-danger"
                >
                  Remove
                </button>
              )}
            </div>

            <input
              value={row.name}
              onChange={(e) => updateRow(index, { name: e.target.value })}
              placeholder="Name (e.g. Morning Run)"
              aria-label="Habit name"
              className={inputClasses}
            />
            <input
              value={row.behavior}
              onChange={(e) => updateRow(index, { behavior: e.target.value })}
              placeholder="What exactly will you do?"
              aria-label="Behavior"
              className={inputClasses}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`minimum-${index}`} className="text-sm font-medium text-text-primary">
                Minimum version
              </label>
              <input
                id={`minimum-${index}`}
                type="number"
                value={row.minimumValue}
                onChange={(e) => updateRow(index, { minimumValue: e.target.value })}
                placeholder="e.g. 2"
                required
                className={inputClasses}
              />
              <p className="text-xs text-text-muted">
                The smallest version that still counts as a real success on a hard day.
              </p>
            </div>

            <div className="flex flex-col divide-y divide-border/70 border-t border-border/70">
              <Collapsible label="Frequency">
                <div className="flex items-center gap-2">
                  <Select
                    value={row.frequencyType}
                    onValueChange={(value) =>
                      updateRow(index, { frequencyType: value as HabitRow["frequencyType"] })
                    }
                    options={FREQUENCY_OPTIONS}
                    className="flex-1"
                  />
                  {row.frequencyType === "n_per_week" && (
                    <>
                      <input
                        type="number"
                        min={1}
                        max={7}
                        value={row.n}
                        onChange={(e) => updateRow(index, { n: Number(e.target.value) })}
                        aria-label="Times per week"
                        className={cn("w-20", inputClasses)}
                      />
                      <span className="text-sm text-text-muted">times/week</span>
                    </>
                  )}
                </div>
              </Collapsible>

              <Collapsible label="Target and unit">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input
                    type="number"
                    value={row.targetValue}
                    onChange={(e) => updateRow(index, { targetValue: e.target.value })}
                    placeholder="Target"
                    aria-label="Target value"
                    className={inputClasses}
                  />
                  <input
                    value={row.unit}
                    onChange={(e) => updateRow(index, { unit: e.target.value })}
                    placeholder="Unit (pages, minutes)"
                    aria-label="Unit"
                    className={inputClasses}
                  />
                </div>
              </Collapsible>

              <Collapsible label="When and why">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <label htmlFor={`preferred-time-${index}`} className="text-sm text-text-secondary">
                      Preferred time
                    </label>
                    <input
                      id={`preferred-time-${index}`}
                      type="time"
                      value={row.preferredTime}
                      onChange={(e) => updateRow(index, { preferredTime: e.target.value })}
                      className={inputClasses}
                    />
                  </div>

                  <input
                    value={row.contextTrigger}
                    onChange={(e) => updateRow(index, { contextTrigger: e.target.value })}
                    placeholder="Cue (e.g. after brushing teeth)"
                    aria-label="Cue"
                    className={inputClasses}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-text-secondary">Difficulty: {row.difficulty}/5</label>
                    <Slider
                      value={row.difficulty}
                      onValueChange={(value) => updateRow(index, { difficulty: value })}
                      ariaLabel={`Difficulty for habit ${index + 1}`}
                    />
                  </div>

                  <textarea
                    value={row.reason}
                    onChange={(e) => updateRow(index, { reason: e.target.value })}
                    placeholder="Why does this habit matter to you? (optional)"
                    aria-label="Reason"
                    rows={2}
                    className={inputClasses}
                  />
                </div>
              </Collapsible>
            </div>
          </Card>
        ))}

        {rows.length < MAX_HABITS && (
          <button
            type="button"
            onClick={addRow}
            className="rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
          >
            + Add another habit
          </button>
        )}
      </div>

      <Button onClick={handleContinue} isLoading={isPending} size="lg" className="self-start">
        Finish setup
      </Button>
    </div>
  );
}
