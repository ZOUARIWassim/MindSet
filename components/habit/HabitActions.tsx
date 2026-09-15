"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
  const [isAbandonOpen, setIsAbandonOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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
        toast.error("Couldn't save that. Try again.");
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
              aria-label="Name"
              className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            />
            <input
              value={form.behavior}
              onChange={(e) => setForm((f) => ({ ...f, behavior: e.target.value }))}
              placeholder="Behavior"
              aria-label="Behavior"
              className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <input
                type="number"
                value={form.targetValue}
                onChange={(e) => setForm((f) => ({ ...f, targetValue: e.target.value }))}
                placeholder="Target"
                aria-label="Target value"
                className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
              />
              <input
                type="number"
                value={form.minimumValue}
                onChange={(e) => setForm((f) => ({ ...f, minimumValue: e.target.value }))}
                placeholder="Minimum"
                aria-label="Minimum value"
                className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
              />
              <input
                value={form.unit}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                placeholder="Unit"
                aria-label="Unit"
                className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
            <input
              type="time"
              value={form.preferredTime}
              onChange={(e) => setForm((f) => ({ ...f, preferredTime: e.target.value }))}
              aria-label="Preferred time"
              className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            />
            <input
              value={form.contextTrigger}
              onChange={(e) => setForm((f) => ({ ...f, contextTrigger: e.target.value }))}
              placeholder="Cue"
              aria-label="Cue"
              className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-text-secondary">Difficulty: {form.difficulty}/5</label>
              <Slider
                value={form.difficulty}
                onValueChange={(value) => setForm((f) => ({ ...f, difficulty: value }))}
                ariaLabel="Difficulty"
              />
            </div>
            <textarea
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              rows={2}
              placeholder="Reason"
              aria-label="Reason"
              className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            />
            <Button onClick={handleSaveEdit} isLoading={isPending} className="self-start">
              Save changes
            </Button>
          </div>
        </DialogContent>
      </DialogRoot>

      <Button variant="secondary" onClick={handlePause} disabled={isPending}>
        {habit.status === "paused" ? "Resume" : "Pause"}
      </Button>

      <DialogRoot open={isAbandonOpen} onOpenChange={setIsAbandonOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" disabled={isPending}>
            Abandon
          </Button>
        </DialogTrigger>
        <DialogContent title="Abandon this habit?">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-secondary">
              &ldquo;{habit.name}&rdquo; will stop showing up on Today. You&apos;ll still be able to see
              its history on this page - abandoning isn&apos;t deleting.
            </p>
            <div className="flex items-center gap-2 self-end">
              <Button variant="secondary" onClick={() => setIsAbandonOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleAbandon} isLoading={isPending}>
                Abandon habit
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogRoot>
    </div>
  );
}
