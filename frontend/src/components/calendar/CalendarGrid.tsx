import React, { useMemo } from 'react';
import { startOfMonth, startOfWeek, addDays, format } from 'date-fns';
import CalendarDayCell from './CalendarDayCell';
import { CalendarDayData } from '../../hooks/useCalendarData';

interface CalendarGridProps {
  month: Date;
  days: Map<string, CalendarDayData>;
  selectedDate: Date | null;
  onDaySelect: (date: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarGrid: React.FC<CalendarGridProps> = ({ month, days, selectedDate, onDaySelect }) => {
  const gridDates = useMemo(() => {
    const monthStart = startOfMonth(month);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  }, [month]);

  return (
    <div className="grid grid-cols-7 gap-1">
      {WEEKDAYS.map((day) => (
        <div key={day} className="text-center text-xs font-medium text-text-muted py-2">
          {day}
        </div>
      ))}
      {gridDates.map((date) => {
        const key = format(date, 'yyyy-MM-dd');
        const isSelected = selectedDate ? format(selectedDate, 'yyyy-MM-dd') === key : false;
        return (
          <CalendarDayCell
            key={key}
            date={date}
            currentMonth={month}
            isSelected={isSelected}
            dayData={days.get(key)}
            onClick={onDaySelect}
          />
        );
      })}
    </div>
  );
};

export default CalendarGrid;
