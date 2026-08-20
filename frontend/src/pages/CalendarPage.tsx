import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { useHabits } from '../contexts/HabitContext';
import { useUI } from '../contexts/UIContext';
import { useCalendarData } from '../hooks/useCalendarData';
import CalendarHeader from '../components/calendar/CalendarHeader';
import CalendarGrid from '../components/calendar/CalendarGrid';
import DayDetailPanel from '../components/calendar/DayDetailPanel';
import EmptyState from '../components/ui/EmptyState';

const CalendarPage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { days, loading } = useCalendarData(currentMonth);
  const { habits } = useHabits();
  const { setCurrentDate } = useUI();
  const navigate = useNavigate();

  const handleNavigateToDay = (date: Date) => {
    setCurrentDate(date);
    navigate('/today');
  };

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
      <CalendarHeader month={currentMonth} onMonthChange={setCurrentMonth} />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
          {habits.length === 0 ? (
            <EmptyState
              icon={<Calendar size={48} />}
              title="No habits to track"
              description="Create habits first to see your progress on the calendar"
            />
          ) : (
            <CalendarGrid
              month={currentMonth}
              days={days}
              selectedDate={selectedDate}
              onDaySelect={setSelectedDate}
            />
          )}
        </div>

        <AnimatePresence>
          {selectedDate && (
            <DayDetailPanel
              date={selectedDate}
              entries={days.get(format(selectedDate, 'yyyy-MM-dd'))?.entries ?? []}
              habits={habits}
              onNavigateToDay={handleNavigateToDay}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CalendarPage;
