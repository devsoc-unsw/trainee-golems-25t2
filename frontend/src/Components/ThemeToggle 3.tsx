import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

interface ThemeToggleProps {
  collapsed?: boolean;
}

const THEME_KEY = "theme";
const DARK_CLASS = "dark";

export default function ThemeToggle({ collapsed = false }: ThemeToggleProps) {
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
    <div
      className={`flex items-center justify-center w-full ${
        collapsed ? "flex-col" : "flex-row"
      }`}
    >
      <button
        onClick={() => setDark((d) => !d)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg 
                   bg-gray-200 dark:bg-gray-700 
                   text-gray-800 dark:text-gray-100 
                   hover:bg-gray-300 dark:hover:bg-gray-600 
                   transition"
        aria-label="Toggle dark mode"
      >
        {dark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-500" />}
        {!collapsed && <span className="text-sm">{dark ? "Light Mode" : "Dark Mode"}</span>}
      </button>
    </div>
  );
}
