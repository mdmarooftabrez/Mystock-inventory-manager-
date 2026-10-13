import { Moon, Sun } from "lucide-react";
import Brand from "./Brand";

function Header({ darkMode, onToggleDarkMode }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 transition-colors dark:border-gray-800 dark:bg-gray-900 sm:px-6">
      <div className="sm:hidden"><Brand /></div>
      <button
        type="button"
        aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
        aria-pressed={darkMode}
        title={`Switch to ${darkMode ? "light" : "dark"} mode`}
        onClick={onToggleDarkMode}
        className="rounded-lg border border-gray-200 p-2.5 text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}

export default Header;
