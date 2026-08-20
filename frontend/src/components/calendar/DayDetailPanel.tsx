import React from 'react';
import { format } from 'date-fns';
import { Check, X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { Habit, HabitEntry } from '../../types/habit';
import CategoryIcon from '../common/CategoryIcon';
import Badge from '../ui/Badge';
import ProgressRing from '../ui/ProgressRing';

interface DayDetailPanelProps {
  date: Date;
  entries: HabitEntry[];
  habits: Habit[];
  onNavigateToDay: (date: Date) => void;
}

const DayDetailPanel: React.FC<DayDetailPanelProps> = ({ date, entries, habits, onNavigateToDay }) => {
  const completedCount = entries.filter((e) => e.completed).length;
  const totalCount = entries.length;
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getHabitForEntry = (entry: HabitEntry): Habit | undefined => {
    const habitId = typeof entry.habitId === 'string' ? entry.habitId : (entry.habitId as any)?._id;
    return habits.find((h) => h._id === habitId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      className="w-80 border-l border-border bg-surface h-full overflow-y-auto"
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-text-primary">
            {format(date, 'EEEE, MMM d')}
          </h3>
          <ProgressRing progress={completionRate} size={36} strokeWidth={3}>
            <span className="text-[9px] font-bold text-text-secondary">
              {Math.round(completionRate)}%
            </span>
          </ProgressRing>
        </div>

        {totalCount > 0 && (
          <p className="text-sm text-text-secondary mb-4">
            {completedCount} of {totalCount} habits completed
          </p>
        )}

        {entries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-text-muted mb-3">No entries for this day</p>
            <button
              onClick={() => onNavigateToDay(date)}
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
            >
              Go to this day
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => {
              const habit = getHabitForEntry(entry);
              if (!habit) return null;
              return (
                <div
                  key={entry._id}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors',
                    entry.completed
                      ? 'border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-border bg-surface-secondary'
                  )}
                >
                  <div className={cn(
                    'w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0',
                    entry.completed
                      ? 'bg-emerald-500 text-white'
                      : 'border-2 border-gray-300 dark:border-gray-600'
                  )}>
                    {entry.completed ? <Check size={12} strokeWidth={3} /> : <X size={10} className="text-text-muted" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <CategoryIcon category={habit.category} size={12} />
                      <span className={cn(
                        'text-sm font-medium truncate',
                        entry.completed && 'text-text-muted line-through'
                      )}>
                        {habit.name}
                      </span>
                    </div>
                  </div>
                  <Badge category={habit.category} />
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-border">
          <button
            onClick={() => onNavigateToDay(date)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
          >
            Open daily view
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DayDetailPanel;
