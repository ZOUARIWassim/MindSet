import React from 'react';
import { Check, Pencil } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Habit } from '../../types/habit';
import { categoryColors } from '../../utils/categoryConfig';
import CategoryIcon from '../common/CategoryIcon';

interface TimeBlockProps {
  habit: Habit;
  completed: boolean;
  onToggle: () => void;
  onEdit?: () => void;
}

const TimeBlock: React.FC<TimeBlockProps> = ({ habit, completed, onToggle, onEdit }) => {
  const color = categoryColors[habit.category];

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-200 group',
        completed
          ? 'bg-surface-secondary border-border opacity-60'
          : 'bg-surface border-border hover:shadow-sm'
      )}
      style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
    >
      <button
        onClick={onToggle}
        className={cn(
          'flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
          completed
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-gray-300 dark:border-gray-600 hover:border-accent'
        )}
      >
        {completed && <Check size={12} strokeWidth={3} />}
      </button>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <CategoryIcon category={habit.category} size={14} />
        <span
          className={cn(
            'text-sm font-medium truncate',
            completed ? 'line-through text-text-muted' : 'text-text-primary'
          )}
        >
          {habit.name}
        </span>
      </div>

      {onEdit && (
        <button
          onClick={onEdit}
          className="p-1 rounded text-text-muted hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
        >
          <Pencil size={12} />
        </button>
      )}
    </div>
  );
};

export default TimeBlock;
