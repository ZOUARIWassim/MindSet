import React from 'react';
import { cn } from '../../lib/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border border-border bg-surface p-4',
        'shadow-sm transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-md hover:border-border-secondary',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
