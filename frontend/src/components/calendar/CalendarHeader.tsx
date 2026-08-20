import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, isSameMonth } from 'date-fns';
import { cn } from '../../lib/cn';

interface CalendarHeaderProps {
  month: Date;
  onMonthChange: (month: Date) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ month, onMonthChange }) => {
  const isCurrentMonth = isSameMonth(month, new Date());

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onMonthChange(subMonths(month, 1))}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-lg font-semibold text-text-primary min-w-[160px] text-center">
          {format(month, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => onMonthChange(addMonths(month, 1))}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <button
        onClick={() => onMonthChange(new Date())}
        className={cn(
          'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
          isCurrentMonth
            ? 'bg-accent/10 text-accent cursor-default'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
        )}
        disabled={isCurrentMonth}
      >
        Today
      </button>
    </div>
  );
};

export default CalendarHeader;
