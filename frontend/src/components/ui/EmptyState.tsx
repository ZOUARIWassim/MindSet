import React from 'react';
import { cn } from '../../lib/cn';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, className }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="text-text-muted mb-3">{icon}</div>
      <h3 className="text-base font-medium text-text-primary mb-1">{title}</h3>
      {description && <p className="text-sm text-text-secondary mb-4">{description}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
