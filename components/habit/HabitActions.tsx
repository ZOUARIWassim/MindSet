"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DialogRoot, DialogTrigger, DialogContent } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { editHabit, pauseHabit, abandonHabit } from "@/app/actions/habit";

export interface EditableHabit {
  id: string;
  name: string;
  behavior: string;
  targetValue: number | null;
  minimumValue: number | null;
  unit: string | null;
  preferredTime: string | null;
  contextTrigger: string | null;
  difficulty: number;
  reason: string | null;
  status: "active" | "paused" | "completed" | "abandoned";
}

export function HabitActions({ habit }: { habit: EditableHabit }) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: habit.name,
    behavior: habit.behavior,
    targetValue: habit.targetValue?.toString() ?? "",
    minimumValue: habit.minimumValue?.toString() ?? "",
    unit: habit.unit ?? "",
    preferredTime: habit.preferredTime ?? "",
    contextTrigger: habit.contextTrigger ?? "",
    difficulty: habit.difficulty,
    reason: habit.reason ?? "",
  });

  function handleSaveEdit() {
    setError(null);
    startTransition(async () => {
      try {
        await editHabit(habit.id, {
          name: form.name,
          behavior: form.behavior,
          targetValue: form.targetValue ? Number(form.targetValue) : null,
          minimumValue: form.minimumValue ? Number(form.minimumValue) : null,
          unit: form.unit || null,
          preferredTime: form.preferredTime || null,
          contextTrigger: form.contextTrigger || null,
          difficulty: form.difficulty,
          reason: form.reason || null,
        });
        setIsEditOpen(false);
        router.refresh();
      } catch {
        setError("Couldn't save that. Try again.");
      }
    });
  }

  function handlePause() {
    startTransition(async () => {
      await pauseHabit(habit.id);
      router.refresh();
    });
  }

  function handleAbandon() {
    if (!confirm(`Abandon "${habit.name}"? You can still see its history, but it won't show up on Today.`)) {
      return;
    }
    startTransition(async () => {
      await abandonHabit(habit.id);
      router.push("/today");
    });
  }

  return (
    <div className="flex items-center gap-2">
      <DialogRoot open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary">Edit</Button>
        </DialogTrigger>
        <DialogContent title="Edit habit">
          <div className="flex flex-col gap-3">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Name"
              className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            />
            <input
              value={form.behavior}
              onChange={(e) => setForm((f) => ({ ...f, behavior: e.target.value }))}
              placeholder="Behavior"
              className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={form.targetValue}
                onChange={(e) => setForm((f) => ({ ...f, targetValue: e.target.value }))}
                placeholder="Target"
                className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
              />
              <input
                type="number"
                value={form.minimumValue}
                onChange={(e) => setForm((f) => ({ ...f, minimumValue: e.target.value }))}
                placeholder="Minimum"
                className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
              />
              <input
                value={form.unit}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                placeholder="Unit"
                className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
            <input
              type="time"
              value={form.preferredTime}
              onChange={(e) => setForm((f) => ({ ...f, preferredTime: e.target.value }))}
              className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            />
            <input
              value={form.contextTrigger}
              onChange={(e) => setForm((f) => ({ ...f, contextTrigger: e.target.value }))}
              placeholder="Cue"
              className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-text-secondary">Difficulty: {form.difficulty}/5</label>
              <Slider value={form.difficulty} onValueChange={(value) => setForm((f) => ({ ...f, difficulty: value }))} />
            </div>
            <textarea
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              rows={2}
              placeholder="Reason"
              className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button onClick={handleSaveEdit} disabled={isPending} className="self-start">
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </DialogContent>
      </DialogRoot>

      <Button variant="secondary" onClick={handlePause} disabled={isPending}>
        {habit.status === "paused" ? "Resume" : "Pause"}
      </Button>
      <Button variant="ghost" onClick={handleAbandon} disabled={isPending}>
        Abandon
      </Button>
    </div>
  );
}
