import Link from "next/link";
import { describeProgress } from "@/lib/copy";

export interface HabitProgress {
  id: string;
  name: string;
  behavior: string;
  status: "active" | "paused" | "completed" | "abandoned";
  count: number;
  total: number;
  pct: number;
}

export interface SystemWithProgress {
  id: string;
  name: string;
  description: string | null;
  habits: HabitProgress[];
}

export function SystemList({ systems }: { systems: SystemWithProgress[] }) {
  return (
    <div className="flex flex-col gap-6">
      {systems.map((system) => (
        <div key={system.id} className="flex flex-col gap-3 rounded-xl border border-border p-4">
          <div>
            <p className="font-medium text-text-primary">{system.name}</p>
            {system.description && <p className="text-sm text-text-secondary">{system.description}</p>}
          </div>
          <ul className="flex flex-col gap-2">
            {system.habits.map((habit) => (
              <li key={habit.id}>
                <Link
                  href={`/habits/${habit.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg bg-surface-secondary px-3 py-2 hover:bg-surface-tertiary"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {habit.name}
                      {habit.status === "paused" && (
                        <span className="ml-2 text-xs font-normal text-text-muted">Paused</span>
                      )}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {describeProgress(habit.count, habit.total, "due days")}
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-xs text-text-muted">{habit.pct}%</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
