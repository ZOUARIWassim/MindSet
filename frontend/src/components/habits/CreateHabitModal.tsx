import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import Modal from '../ui/Modal';
import { useHabits } from '../../contexts/HabitContext';
import { useToast } from '../ui/Toast';
import { HabitCategory, HabitType, HabitFrequency, CreateHabitData } from '../../types/habit';
import CategoryIcon from '../common/CategoryIcon';
import { cn } from '../../lib/cn';
import api from '../../services/api';

interface HabitTemplate {
  name: string;
  description: string;
  category: HabitCategory;
  type: HabitType;
  frequency: string;
  target?: number;
  unit?: string;
  reminderTime?: string;
}

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryOptions: { key: HabitCategory; label: string }[] = [
  { key: 'spiritual', label: 'Spiritual' },
  { key: 'workout', label: 'Workout' },
  { key: 'nutrition', label: 'Nutrition' },
  { key: 'personal', label: 'Personal' },
  { key: 'other', label: 'Other' },
];

const CreateHabitModal: React.FC<CreateHabitModalProps> = ({ isOpen, onClose }) => {
  const { createHabit } = useHabits();
  const toast = useToast();
  const [mode, setMode] = useState<'templates' | 'custom'>('templates');
  const [templates, setTemplates] = useState<HabitTemplate[]>([]);
  const [templateCategory, setTemplateCategory] = useState<HabitCategory | 'all'>('all');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('personal');
  const [type, setType] = useState<HabitType>('boolean');
  const [reminderTime, setReminderTime] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && templates.length === 0) {
      api.get<{ templates: HabitTemplate[] }>('/templates').then((res) => {
        setTemplates(res.data.templates);
      }).catch(() => {});
    }
  }, [isOpen]);

  const handleTemplateSelect = async (template: HabitTemplate) => {
    setSubmitting(true);
    try {
      const data: CreateHabitData = {
        name: template.name,
        description: template.description,
        category: template.category,
        type: template.type,
        frequency: template.frequency as HabitFrequency || 'daily',
        reminderTime: template.reminderTime || undefined,
        target: template.target,
        unit: template.unit,
      };
      await createHabit(data);
      toast.success(`Added "${template.name}"`);
    } catch {
      toast.error('Failed to create habit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const data: CreateHabitData = {
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        type,
        frequency,
        reminderTime: reminderTime || undefined,
        target: target ? Number(target) : undefined,
        unit: unit.trim() || undefined,
      };
      await createHabit(data);
      toast.success('Habit created');
      resetForm();
      onClose();
    } catch {
      toast.error('Failed to create habit');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('personal');
    setFrequency('daily');
    setType('boolean');
    setReminderTime('');
    setTarget('');
    setUnit('');
  };

  const filteredTemplates = templateCategory === 'all'
    ? templates
    : templates.filter((t) => t.category === templateCategory);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Habit" className="max-w-lg">
      <div className="flex items-center gap-1 mb-4 bg-surface-secondary rounded-lg p-1">
        <button
          type="button"
          onClick={() => setMode('templates')}
          className={cn(
            'flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            mode === 'templates' ? 'bg-surface text-text-primary shadow-sm' : 'text-text-secondary'
          )}
        >
          <span className="inline-flex items-center gap-1.5"><Zap size={14} /> Quick Add</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('custom')}
          className={cn(
            'flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            mode === 'custom' ? 'bg-surface text-text-primary shadow-sm' : 'text-text-secondary'
          )}
        >
          Custom
        </button>
      </div>

      {mode === 'templates' ? (
        <div className="space-y-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {[{ key: 'all' as const, label: 'All' }, ...categoryOptions].map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setTemplateCategory(cat.key)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors',
                  templateCategory === cat.key
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-muted hover:text-text-primary hover:bg-surface-secondary'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="max-h-[320px] overflow-y-auto space-y-1.5 pr-1">
            {filteredTemplates.map((template) => (
              <button
                key={template.name}
                type="button"
                onClick={() => handleTemplateSelect(template)}
                disabled={submitting}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all text-left disabled:opacity-50"
              >
                <CategoryIcon category={template.category} size={16} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{template.name}</p>
                  <p className="text-xs text-text-muted truncate">{template.description}</p>
                </div>
                {template.reminderTime && (
                  <span className="text-[10px] text-text-muted bg-surface-secondary px-1.5 py-0.5 rounded">
                    {template.reminderTime}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Fajr Prayer"
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description..."
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
            <p className="text-xs text-text-muted mt-1">Sets when this habit appears on your daily timeline</p>
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
                  placeholder="e.g., 30"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Unit</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g., minutes"
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
              {submitting ? 'Creating...' : 'Create Habit'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default CreateHabitModal;
