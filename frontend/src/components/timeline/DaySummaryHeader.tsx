import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { isToday } from 'date-fns';
import ProgressRing from '../ui/ProgressRing';
import { formatDateLabel, getNextDay, getPrevDay } from '../../utils/dateUtils';
import { cn } from '../../lib/cn';

interface DaySummaryHeaderProps {
  date: Date;
  onDateChange: (date: Date) => void;
  completedCount: number;
  totalCount: number;
}

const DaySummaryHeader: React.FC<DaySummaryHeaderProps> = ({
  date,
  onDateChange,
  completedCount,
  totalCount,
}) => {
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const today = isToday(date);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDateChange(getPrevDay(date))}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => onDateChange(new Date())}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              today
                ? 'bg-accent/10 text-accent'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
            )}
          >
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{formatDateLabel(date)}</span>
            </div>
          </button>
          <button
            onClick={() => onDateChange(getNextDay(date))}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs text-text-muted">Completed</p>
          <p className="text-sm font-semibold text-text-primary">
            {completedCount}/{totalCount}
          </p>
        </div>
        <ProgressRing progress={progress} size={40} strokeWidth={3.5}>
          <span className="text-[10px] font-bold text-text-primary">{Math.round(progress)}%</span>
        </ProgressRing>
      </div>
    </div>
  );
};

export default DaySummaryHeader;
