import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

interface ThemeToggleProps {
  collapsed?: boolean;
}

const THEME_KEY = "theme";
const DARK_CLASS = "dark";

export default function ThemeToggle({
  collapsed = false,
}: ThemeToggleProps = {}) {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add(DARK_CLASS);
      localStorage.setItem(THEME_KEY, "dark");
    } else {
      document.documentElement.classList.remove(DARK_CLASS);
      localStorage.setItem(THEME_KEY, "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="flex items-center justify-center w-12 h-12 rounded-full 
                 bg-white/80 dark:bg-gray-800/80 
                 border-2 border-gray-200 dark:border-gray-600
                 shadow-lg hover:shadow-xl
                 text-gray-700 dark:text-gray-200 
                 hover:bg-white dark:hover:bg-gray-800
                 hover:scale-110 active:scale-95
                 backdrop-blur-sm
                 transition-all duration-300 ease-in-out
                 group"
      aria-label="Toggle dark mode"
    >
      <div className="relative">
        {dark ? (
          <FaSun className="text-yellow-500 text-lg group-hover:text-yellow-400 transition-colors" />
        ) : (
          <FaMoon className="text-blue-600 text-lg group-hover:text-blue-500 transition-colors" />
        )}
      </div>
    </button>
  );
}
