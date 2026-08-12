import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useHabits } from '../contexts/HabitContext';
import { useNavigate } from 'react-router-dom';
import HabitCard from '../components/HabitCard';
import CreateHabitModal from '../components/CreateHabitModal';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { habits, todayEntries, loading } = useHabits();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const groupedHabits = {
    spiritual: habits.filter((h) => h.category === 'spiritual'),
    workout: habits.filter((h) => h.category === 'workout'),
    nutrition: habits.filter((h) => h.category === 'nutrition'),
    personal: habits.filter((h) => h.category === 'personal'),
    other: habits.filter((h) => h.category === 'other')
  };

  const completedToday = Array.from(todayEntries.values()).filter((e) => e.completed).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Loading your habits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">MindSet</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name}!</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Today's Progress</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-blue-600">{completedToday}</span>
              <span className="text-lg text-gray-500 ml-2">/ {totalHabits}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{completionRate}% complete</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Habits</h3>
            <div className="text-3xl font-bold text-green-600">{totalHabits}</div>
            <p className="text-sm text-gray-600 mt-2">Active habits tracked</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Quick Actions</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add New Habit
            </button>
          </div>
        </div>

        {/* Habits Section */}
        {habits.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Habits Yet</h2>
            <p className="text-gray-600 mb-6">
              Start building your discipline by creating your first habit!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spiritual Habits */}
            {groupedHabits.spiritual.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🕌</span> Spiritual Habits
                </h2>
                <div className="space-y-3">
                  {groupedHabits.spiritual.map((habit) => (
                    <HabitCard key={habit._id} habit={habit} />
                  ))}
                </div>
              </div>
            )}

            {/* Workout Habits */}
            {groupedHabits.workout.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">💪</span> Workout Habits
                </h2>
                <div className="space-y-3">
                  {groupedHabits.workout.map((habit) => (
                    <HabitCard key={habit._id} habit={habit} />
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition Habits */}
            {groupedHabits.nutrition.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🥗</span> Nutrition Habits
                </h2>
                <div className="space-y-3">
                  {groupedHabits.nutrition.map((habit) => (
                    <HabitCard key={habit._id} habit={habit} />
                  ))}
                </div>
              </div>
            )}

            {/* Personal Habits */}
            {groupedHabits.personal.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📚</span> Personal Habits
                </h2>
                <div className="space-y-3">
                  {groupedHabits.personal.map((habit) => (
                    <HabitCard key={habit._id} habit={habit} />
                  ))}
                </div>
              </div>
            )}

            {/* Other Habits */}
            {groupedHabits.other.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">⭐</span> Other Habits
                </h2>
                <div className="space-y-3">
                  {groupedHabits.other.map((habit) => (
                    <HabitCard key={habit._id} habit={habit} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-2">Tips for Success</h2>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>Check off habits as you complete them throughout the day</li>
            <li>Build consistency by tracking daily - even small wins count!</li>
            <li>Create specific, measurable habits for better tracking</li>
            <li>Start with 3-5 core habits, then expand gradually</li>
            <li>Review your progress weekly to stay motivated</li>
          </ul>
        </div>
      </main>

      {/* Create Habit Modal */}
      <CreateHabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
