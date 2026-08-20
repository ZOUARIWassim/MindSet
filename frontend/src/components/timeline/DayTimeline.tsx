import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Habit, HabitEntry } from '../../types/habit';
import { formatTime, parseReminderTimeToHour } from '../../utils/dateUtils';
import TimeBlock from './TimeBlock';
import CurrentTimeIndicator from './CurrentTimeIndicator';
import EditHabitModal from '../habits/EditHabitModal';
import { isToday } from 'date-fns';
import { cn } from '../../lib/cn';

interface DayTimelineProps {
  habits: Habit[];
  entries: Map<string, HabitEntry>;
  onToggle: (habitId: string) => void;
  date: Date;
}

const HOUR_HEIGHT = 72;

const DayTimeline: React.FC<DayTimelineProps> = ({ habits, entries, onToggle, date }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const showCurrentTime = isToday(date);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const { scheduled, unscheduled } = useMemo(() => {
    const scheduled: Record<number, Habit[]> = {};
    const unscheduled: Habit[] = [];

    habits.forEach((habit) => {
      const hour = parseReminderTimeToHour(habit.reminderTime);
      if (hour !== null) {
        if (!scheduled[hour]) scheduled[hour] = [];
        scheduled[hour].push(habit);
      } else {
        unscheduled.push(habit);
      }
    });

    return { scheduled, unscheduled };
  }, [habits]);

  useEffect(() => {
    if (showCurrentTime && containerRef.current) {
      const now = new Date();
      const scrollTo = (now.getHours() - 1) * HOUR_HEIGHT;
      containerRef.current.scrollTop = Math.max(0, scrollTo);
    }
  }, [showCurrentTime]);

  return (
    <div className="flex flex-col h-full">
      {editingHabit && (
        <EditHabitModal
          isOpen={!!editingHabit}
          onClose={() => setEditingHabit(null)}
          habit={editingHabit}
        />
      )}

      {unscheduled.length > 0 && (
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Anytime</h3>
          <div className="space-y-1.5">
            {unscheduled.map((habit) => (
              <TimeBlock
                key={habit._id}
                habit={habit}
                completed={entries.get(habit._id)?.completed ?? false}
                onToggle={() => onToggle(habit._id)}
                onEdit={() => setEditingHabit(habit)}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={containerRef} className="flex-1 overflow-y-auto relative">
        <div className="relative" style={{ height: 24 * HOUR_HEIGHT }}>
          {showCurrentTime && <CurrentTimeIndicator hourHeight={HOUR_HEIGHT} />}

          {Array.from({ length: 24 }, (_, hour) => (
            <div
              key={hour}
              className="absolute left-0 right-0 border-b border-border/50"
              style={{ top: hour * HOUR_HEIGHT, height: HOUR_HEIGHT }}
            >
              <div className="flex h-full">
                <div className="w-16 flex-shrink-0 pt-1 pr-3 text-right">
                  <span className="text-xs text-text-muted font-medium">{formatTime(hour)}</span>
                </div>
                <div className={cn(
                  'flex-1 pl-3 pt-1 border-l border-border/50',
                  'space-y-1'
                )}>
                  {scheduled[hour]?.map((habit) => (
                    <TimeBlock
                      key={habit._id}
                      habit={habit}
                      completed={entries.get(habit._id)?.completed ?? false}
                      onToggle={() => onToggle(habit._id)}
                      onEdit={() => setEditingHabit(habit)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayTimeline;
