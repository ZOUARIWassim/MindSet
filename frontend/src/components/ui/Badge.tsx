import React from 'react';
import { cn } from '../../lib/cn';
import { HabitCategory } from '../../types/habit';
import { categoryConfig } from '../../utils/categoryConfig';

interface BadgeProps {
  category: HabitCategory;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ category, className }) => {
  const config = categoryConfig[category];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        config.bgLight,
        config.bgDark,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default Badge;
