import { Moon, Sun } from "lucide-react";
import Brand from "./Brand";

function Header({ darkMode, onToggleDarkMode }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 transition-colors dark:border-gray-800 dark:bg-gray-900 sm:h-16 sm:px-6">
      <div className="sm:hidden">
        <Brand />
      </div>
      <button
        type="button"
        title={`Switch to ${darkMode ? "light" : "dark"} mode`}
        onClick={onToggleDarkMode}
        className="grid h-11 w-11 place-items-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        <span className="sr-only">
          Switch to {darkMode ? "light" : "dark"} mode
        </span>
      </button>
    </header>
  );
}

export default Header;
