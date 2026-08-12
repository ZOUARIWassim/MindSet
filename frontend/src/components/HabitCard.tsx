import React from 'react';
import { Habit } from '../types/habit';
import { useHabits } from '../contexts/HabitContext';

interface HabitCardProps {
  habit: Habit;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const { todayEntries, toggleHabit } = useHabits();
  const entry = todayEntries.get(habit._id);
  const isCompleted = entry?.completed || false;

  const handleToggle = async () => {
    try {
      await toggleHabit(habit._id);
    } catch (error) {
      console.error('Failed to toggle habit:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'spiritual':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'workout':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'nutrition':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'personal':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
        isCompleted ? 'bg-green-50 border-green-400' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center space-x-3 flex-1">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggle}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {habit.name}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(habit.category)}`}>
              {habit.category}
            </span>
          </div>
          {habit.description && (
            <p className="text-xs text-gray-500 mt-1">{habit.description}</p>
          )}
        </div>
      </div>
      {isCompleted && (
        <span className="text-green-600 text-xl">✓</span>
      )}
    </div>
  );
};

export default HabitCard;
