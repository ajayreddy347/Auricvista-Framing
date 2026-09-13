import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      className={`group relative inline-flex items-center justify-center p-2 rounded-full transition-all duration-200 cursor-pointer select-none border backdrop-blur-md ${
        isDark
          ? 'bg-[#12110c]/90 border-[#d4af37]/35 hover:border-[#fae69e] text-[#fae69e] shadow-[0_0_12px_-4px_rgba(212,175,55,0.25)] hover:shadow-[0_0_20px_-3px_rgba(212,175,55,0.45)]'
          : 'bg-white border-[#e7e4dc] hover:border-[#b89120] text-[#8f6208] shadow-xs hover:shadow-md'
      } ${className}`}
    >
      {/* Show ONLY ONE icon/control at a time */}
      {isDark ? (
        <Sun className="w-4 h-4 text-[#fae69e] group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-[#8f6208] group-hover:-rotate-12 transition-transform duration-300" />
      )}

      {showLabel && (
        <span className="text-xs font-mono font-semibold uppercase tracking-wider pl-1.5 pr-1">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};
