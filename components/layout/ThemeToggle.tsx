"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "mindset-theme";

export function ThemeToggle() {
  function toggle() {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full",
        "border border-border bg-surface-secondary text-text-secondary",
        "hover:text-text-primary transition-colors",
      )}
    >
      <Sun size={16} className="hidden dark:block" />
      <Moon size={16} className="block dark:hidden" />
    </button>
  );
}
