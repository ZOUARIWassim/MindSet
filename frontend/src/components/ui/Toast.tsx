import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant) => {
    const id = String(++toastId);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value: ToastContextType = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const variantConfig: Record<ToastVariant, { icon: LucideIcon; colors: string }> = {
  success: { icon: CheckCircle2, colors: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
  error: { icon: XCircle, colors: 'text-red-500 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800' },
  info: { icon: Info, colors: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' },
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const config = variantConfig[toast.variant];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg min-w-[280px] max-w-[380px]',
        config.colors
      )}
    >
      <Icon size={18} className="flex-shrink-0" />
      <span className="text-sm font-medium text-text-primary flex-1">{toast.message}</span>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 p-0.5 rounded text-text-muted hover:text-text-primary transition-colors"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
