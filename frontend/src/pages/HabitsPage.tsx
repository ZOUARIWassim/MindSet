import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target } from 'lucide-react';
import { useHabits } from '../contexts/HabitContext';
import { HabitCategory } from '../types/habit';
import HabitCard from '../components/habits/HabitCard';
import CreateHabitModal from '../components/habits/CreateHabitModal';
import EmptyState from '../components/ui/EmptyState';
import { cn } from '../lib/cn';

const categories: { key: HabitCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'spiritual', label: 'Spiritual' },
  { key: 'workout', label: 'Workout' },
  { key: 'nutrition', label: 'Nutrition' },
  { key: 'personal', label: 'Personal' },
  { key: 'other', label: 'Other' },
];

const HabitsPage: React.FC = () => {
  const { habits, todayEntries, toggleHabit, loading } = useHabits();
  const [activeCategory, setActiveCategory] = useState<HabitCategory | 'all'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredHabits = useMemo(() => {
    const active = habits.filter((h) => h.active);
    if (activeCategory === 'all') return active;
    return active.filter((h) => h.category === activeCategory);
  }, [habits, activeCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Habits</h1>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
        >
          <Plus size={16} />
          New Habit
        </button>
      </div>

      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              activeCategory === cat.key
                ? 'bg-accent/10 text-accent'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filteredHabits.length === 0 ? (
        <EmptyState
          icon={<Target size={48} />}
          title="No habits yet"
          description={activeCategory === 'all' ? 'Create your first habit to start building consistency' : `No ${activeCategory} habits found`}
          action={
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
            >
              <Plus size={16} />
              Create Habit
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              entry={todayEntries.get(habit._id)}
              onToggle={() => toggleHabit(habit._id)}
            />
          ))}
        </div>
      )}

      <CreateHabitModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </motion.div>
  );
};

export default HabitsPage;
