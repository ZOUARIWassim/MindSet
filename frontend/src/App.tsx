import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { HabitProvider } from './contexts/HabitContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { UIProvider } from './contexts/UIContext';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DailyView from './pages/DailyView';
import HabitsPage from './pages/HabitsPage';
import CalendarPage from './pages/CalendarPage';

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <HabitProvider>
              <UIProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/today" element={<DailyView />} />
                  <Route path="/habits" element={<HabitsPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                </Route>
                <Route path="/" element={<Navigate to="/today" replace />} />
                <Route path="/dashboard" element={<Navigate to="/today" replace />} />
                <Route path="*" element={<Navigate to="/today" replace />} />
              </Routes>
              </UIProvider>
            </HabitProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
