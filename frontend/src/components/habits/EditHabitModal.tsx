import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useHabits } from '../../contexts/HabitContext';
import { useToast } from '../ui/Toast';
import { Habit, HabitCategory, HabitType, HabitFrequency } from '../../types/habit';
import CategoryIcon from '../common/CategoryIcon';
import { cn } from '../../lib/cn';

interface EditHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit;
}

const categoryOptions: { key: HabitCategory; label: string }[] = [
  { key: 'spiritual', label: 'Spiritual' },
  { key: 'workout', label: 'Workout' },
  { key: 'nutrition', label: 'Nutrition' },
  { key: 'personal', label: 'Personal' },
  { key: 'other', label: 'Other' },
];

const EditHabitModal: React.FC<EditHabitModalProps> = ({ isOpen, onClose, habit }) => {
  const { updateHabit } = useHabits();
  const toast = useToast();
  const [name, setName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description || '');
  const [category, setCategory] = useState<HabitCategory>(habit.category);
  const [frequency, setFrequency] = useState<HabitFrequency>(habit.frequency);
  const [reminderTime, setReminderTime] = useState(habit.reminderTime || '');
  const [type, setType] = useState<HabitType>(habit.type);
  const [target, setTarget] = useState(habit.target?.toString() || '');
  const [unit, setUnit] = useState(habit.unit || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(habit.name);
      setDescription(habit.description || '');
      setCategory(habit.category);
      setFrequency(habit.frequency);
      setReminderTime(habit.reminderTime || '');
      setType(habit.type);
      setTarget(habit.target?.toString() || '');
      setUnit(habit.unit || '');
    }
  }, [isOpen, habit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await updateHabit(habit._id, {
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        type,
        frequency,
        reminderTime: reminderTime || undefined,
        target: target ? Number(target) : undefined,
        unit: unit.trim() || undefined,
      });
      toast.success('Habit updated');
      onClose();
    } catch {
      toast.error('Failed to update habit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Habit" className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Description (optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Category</label>
          <div className="grid grid-cols-5 gap-2">
            {categoryOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setCategory(opt.key)}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-lg border text-xs font-medium transition-all',
                  category === opt.key
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border text-text-secondary hover:border-border-secondary'
                )}
              >
                <CategoryIcon category={opt.key} size={18} />
                <span className="truncate w-full text-center text-[10px]">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Frequency</label>
          <div className="grid grid-cols-3 gap-2">
            {([['daily', 'Daily'], ['weekly', 'Weekly'], ['monthly', 'Monthly']] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFrequency(key)}
                className={cn(
                  'px-3 py-2 rounded-lg border text-sm font-medium transition-all',
                  frequency === key
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border text-text-secondary hover:border-border-secondary'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Schedule Time (optional)</label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as HabitType)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
          >
            <option value="boolean">Yes / No</option>
            <option value="numeric">Numeric</option>
            <option value="duration">Duration</option>
            <option value="text">Text</option>
          </select>
        </div>

        {(type === 'numeric' || type === 'duration') && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Target</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              />
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-border text-text-secondary text-sm font-medium hover:bg-surface-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || submitting}
            className="flex-1 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditHabitModal;
