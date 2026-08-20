import React, { useState } from 'react';
import { Check, Flame, Clock, Trash2, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { Habit, HabitEntry } from '../../types/habit';
import { categoryColors } from '../../utils/categoryConfig';
import { useHabitStats } from '../../hooks/useHabitStats';
import { useHabits } from '../../contexts/HabitContext';
import { useToast } from '../ui/Toast';
import ProgressRing from '../ui/ProgressRing';
import Badge from '../ui/Badge';
import CategoryIcon from '../common/CategoryIcon';
import ConfirmDialog from '../ui/ConfirmDialog';
import EditHabitModal from './EditHabitModal';

interface HabitCardProps {
  habit: Habit;
  entry?: HabitEntry;
  onToggle: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, entry, onToggle }) => {
  const { deleteHabit } = useHabits();
  const { stats } = useHabitStats(habit._id, 7);
  const toast = useToast();
  const completed = entry?.completed ?? false;
  const color = categoryColors[habit.category];
  const completionRate = stats?.completionRate ?? 0;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteHabit(habit._id);
      toast.success('Habit deleted');
    } catch {
      toast.error('Failed to delete habit');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'group relative rounded-xl border bg-surface p-4 transition-all duration-200',
          completed ? 'border-emerald-200 dark:border-emerald-800/50' : 'border-border hover:shadow-md'
        )}
        style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={onToggle}
            className={cn(
              'flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all mt-0.5',
              completed
                ? 'border-emerald-500 bg-emerald-500 text-white scale-105'
                : 'border-gray-300 dark:border-gray-600 hover:border-accent hover:scale-105'
            )}
          >
            {completed && <Check size={14} strokeWidth={3} />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CategoryIcon category={habit.category} size={14} />
              <h3
                className={cn(
                  'text-sm font-semibold truncate',
                  completed ? 'line-through text-text-muted' : 'text-text-primary'
                )}
              >
                {habit.name}
              </h3>
            </div>

            {habit.description && (
              <p className="text-xs text-text-secondary mb-2 line-clamp-1">{habit.description}</p>
            )}

            <div className="flex items-center gap-3">
              <Badge category={habit.category} />
              {habit.frequency !== 'daily' && (
                <span className="text-[10px] font-medium text-text-muted bg-surface-secondary px-1.5 py-0.5 rounded capitalize">
                  {habit.frequency}
                </span>
              )}
              {habit.reminderTime && (
                <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                  <Clock size={11} />
                  {habit.reminderTime}
                </span>
              )}
              {stats && stats.currentStreak > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-500">
                  <Flame size={12} />
                  {stats.currentStreak}d
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ProgressRing progress={completionRate * 100} size={36} strokeWidth={3} color={color}>
              <span className="text-[9px] font-bold text-text-secondary">
                {Math.round(completionRate * 100)}%
              </span>
            </ProgressRing>
            <button
              onClick={() => setShowEditModal(true)}
              className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Habit?"
        description="This habit will be archived and removed from your daily view."
        confirmLabel="Delete"
        loading={deleting}
      />

      <EditHabitModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        habit={habit}
      />
    </>
  );
};

export default HabitCard;
