"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { saveCheckInMeta } from "@/app/actions/checkin";
import type { LocalDate } from "@/domain/timezone";

const METRICS = [
  { key: "energy", label: "Energy" },
  { key: "mood", label: "Mood" },
  { key: "stress", label: "Stress" },
  { key: "focus", label: "Focus" },
] as const;

export function CheckInMetaForm({
  date,
  initial,
}: {
  date: LocalDate;
  initial: { energy: number; mood: number; stress: number; focus: number; note: string };
}) {
  const [values, setValues] = useState(initial);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      try {
        await saveCheckInMeta(date, values);
        toast.success("Check-in saved.");
      } catch {
        toast.error("Couldn't save that. Try again.");
      }
    });
  }

  return (
    <Card className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-text-primary">How are you doing today?</p>

      {METRICS.map(({ key, label }) => (
        <div key={key} className="flex flex-col gap-1.5">
          <label className="text-sm text-text-secondary">
            {label}: {values[key]}/5
          </label>
          <Slider
            value={values[key]}
            onValueChange={(next) => setValues((v) => ({ ...v, [key]: next }))}
            ariaLabel={label}
          />
        </div>
      ))}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="checkin-note" className="text-sm text-text-secondary">
          Note (optional)
        </label>
        <textarea
          id="checkin-note"
          value={values.note}
          onChange={(e) => setValues((v) => ({ ...v, note: e.target.value }))}
          rows={2}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
      </div>

      <Button onClick={handleSave} isLoading={isPending} variant="secondary" className="self-start">
        Save
      </Button>
    </Card>
  );
}
