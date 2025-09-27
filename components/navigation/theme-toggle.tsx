"use client";

import {Moon, Sun} from "lucide-react";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";

type ThemeToggleProps = {
  label: string;
};

export function ThemeToggle({label}: ThemeToggleProps) {
  const {theme, setTheme, systemTheme} = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label={label}
        className="inline-flex w-full items-center justify-between rounded-full border border-secondary/30 px-4 py-2 text-sm font-medium text-secondary dark:border-surface/20 dark:text-surface/80"
        disabled
      >
        <span>{label}</span>
        <span className="text-xs uppercase tracking-[0.2em]">…</span>
      </button>
    );
  }

  const icon = currentTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex w-full items-center justify-between rounded-full border border-secondary/30 px-4 py-2 text-sm font-medium text-secondary transition-colors duration-200 ease-soft-sine hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-surface/20 dark:text-surface/80 dark:hover:border-accent dark:hover:text-accent"
      onClick={() => setTheme(nextTheme)}
    >
      <span>{label}</span>
      <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
        {icon}
        {nextTheme === "dark" ? "Dark" : "Light"}
      </span>
    </button>
  );
}