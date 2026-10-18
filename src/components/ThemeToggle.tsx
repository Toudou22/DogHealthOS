/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme-preference');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme-preference', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme-preference', 'light');
    }
  }, [isDark]);

  return (
    <button
      id="themeToggle"
      onClick={() => setIsDark(!isDark)}
      className="fixed top-4 right-4 z-50 w-11 h-11 rounded-xl border-[2.5px] border-[#1A1A1A] dark:border-[#F0ECE6] bg-white/70 dark:bg-[#1E1C18]/80 backdrop-blur-md cursor-pointer flex items-center justify-center shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#1A1A1A] dark:hover:shadow-[4px_4px_0_#F0ECE6] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#1A1A1A] dark:active:shadow-[1px_1px_0_#F0ECE6] transition-all text-[#1A1A1A] dark:text-[#F0ECE6]"
      aria-label="Toggle visual contrast theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-[#E5A836] animate-pulse" />
      ) : (
        <Moon className="w-5 h-5 text-[#B87333]" />
      )}
    </button>
  );
}
