import React from 'react';
import { SunIcon, MoonIcon, SparklesIcon } from './icons';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDarkMode }) => {
  return (
    <header className="py-4 px-6 flex justify-between items-center text-zinc-800 dark:text-zinc-200">
      <div className="flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-red-500" />
        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">
          WEBER
        </h1>
      </div>
      <button
        onClick={onToggleDarkMode}
        className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors duration-200"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-zinc-700" />}
      </button>
    </header>
  );
};

export default Header;