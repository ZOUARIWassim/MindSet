import React from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../contexts/HabitContext';
import { useUI } from '../contexts/UIContext';
import DaySummaryHeader from '../components/timeline/DaySummaryHeader';
import DayTimeline from '../components/timeline/DayTimeline';
import EmptyState from '../components/ui/EmptyState';
import { CalendarDays, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DailyView: React.FC = () => {
  const { habits, todayEntries, toggleHabit, loading } = useHabits();
  const { currentDate, setCurrentDate } = useUI();
  const navigate = useNavigate();

  const activeHabits = habits.filter((h) => h.active);
  const completedCount = activeHabits.filter((h) => todayEntries.get(h._id)?.completed).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen"
    >
      <DaySummaryHeader
        date={currentDate}
        onDateChange={setCurrentDate}
        completedCount={completedCount}
        totalCount={activeHabits.length}
      />

      {activeHabits.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={48} />}
          title="No habits scheduled"
          description="Create your first habit to start tracking your day"
          action={
            <button
              onClick={() => navigate('/habits')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
            >
              <Plus size={16} />
              Add Habit
            </button>
          }
        />
      ) : (
        <DayTimeline
          habits={activeHabits}
          entries={todayEntries}
          onToggle={toggleHabit}
          date={currentDate}
        />
      )}
    </motion.div>
  );
};

export default DailyView;
