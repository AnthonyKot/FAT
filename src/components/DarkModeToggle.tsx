import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../utils/ThemeContext';

interface DarkModeToggleProps {
  className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = '' }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-2 rounded-full transition-colors ${
        darkMode 
          ? 'bg-gray-700 hover:bg-gray-600 text-yellow-200' 
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
      } ${className}`}
    >
      {darkMode ? (
        <Sun size={18} className="animate-fadeIn" />
      ) : (
        <Moon size={18} className="animate-fadeIn" />
      )}
    </button>
  );
};

export default DarkModeToggle;