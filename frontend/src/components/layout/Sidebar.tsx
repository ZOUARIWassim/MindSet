import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CalendarDays, Target, Calendar, BarChart3, Sun, Moon, Monitor, PanelLeftClose, PanelLeft, LogOut } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useTheme } from '../../contexts/ThemeContext';
import { useUI } from '../../contexts/UIContext';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { path: '/today', label: 'Today', icon: CalendarDays },
  { path: '/habits', label: 'Habits', icon: Target },
  { path: '/calendar', label: 'Calendar', icon: Calendar },
  { path: '/stats', label: 'Stats', icon: BarChart3 },
];

const Sidebar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { sidebarCollapsed, setSidebarCollapsed } = useUI();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full z-40 flex flex-col border-r border-border bg-surface transition-all duration-200',
        sidebarCollapsed ? 'w-16' : 'w-56'
      )}
    >
      <div className={cn('flex items-center h-14 px-4 border-b border-border', sidebarCollapsed && 'justify-center')}>
        {!sidebarCollapsed && (
          <h1 className="text-lg font-bold text-text-primary tracking-tight">MindSet</h1>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={cn(
            'p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-colors',
            !sidebarCollapsed && 'ml-auto'
          )}
        >
          {sidebarCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent dark:text-accent-light'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary',
                sidebarCollapsed && 'justify-center px-2'
              )
            }
          >
            <item.icon size={20} />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 py-3 border-t border-border space-y-1">
        <button
          onClick={cycleTheme}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors',
            sidebarCollapsed && 'justify-center px-2'
          )}
        >
          <ThemeIcon size={18} />
          {!sidebarCollapsed && <span className="capitalize">{theme}</span>}
        </button>
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors',
            sidebarCollapsed && 'justify-center px-2'
          )}
        >
          <LogOut size={18} />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
