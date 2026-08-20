import React from 'react';
import { format, isToday, isSameMonth } from 'date-fns';
import { cn } from '../../lib/cn';
import { CalendarDayData } from '../../hooks/useCalendarData';

interface CalendarDayCellProps {
  date: Date;
  currentMonth: Date;
  isSelected: boolean;
  dayData?: CalendarDayData;
  onClick: (date: Date) => void;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  date,
  currentMonth,
  isSelected,
  dayData,
  onClick,
}) => {
  const today = isToday(date);
  const inMonth = isSameMonth(date, currentMonth);
  const hasEntries = dayData && dayData.totalCount > 0;
  const completionRate = dayData?.completionRate ?? 0;

  const getIndicatorColor = () => {
    if (!hasEntries) return '';
    if (completionRate >= 0.8) return 'bg-emerald-500';
    if (completionRate >= 0.5) return 'bg-amber-500';
    if (completionRate > 0) return 'bg-orange-400';
    return 'bg-gray-300 dark:bg-gray-600';
  };

  return (
    <button
      onClick={() => onClick(date)}
      className={cn(
        'relative flex flex-col items-center justify-center p-2 rounded-xl aspect-square transition-all',
        inMonth ? 'text-text-primary' : 'text-text-muted/40',
        isSelected && 'ring-2 ring-accent bg-accent/5',
        today && !isSelected && 'bg-surface-secondary',
        !isSelected && inMonth && 'hover:bg-surface-secondary'
      )}
    >
      <span
        className={cn(
          'text-sm font-medium',
          today && 'text-accent font-bold'
        )}
      >
        {format(date, 'd')}
      </span>
      {hasEntries && (
        <div className="flex items-center gap-0.5 mt-1">
          <div className={cn('w-1.5 h-1.5 rounded-full', getIndicatorColor())} />
          <span className="text-[9px] text-text-muted font-medium">
            {dayData.completedCount}/{dayData.totalCount}
          </span>
        </div>
      )}
    </button>
  );
};

export default CalendarDayCell;
