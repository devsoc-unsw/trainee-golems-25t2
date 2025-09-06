import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const THEME_KEY = "theme";
const DARK_CLASS = "dark";

export default function ThemeToggle() {
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
      className="relative w-14 h-7 rounded-full 
                 bg-gray-200 dark:bg-gray-700
                 border border-gray-300 dark:border-gray-600
                 hover:bg-gray-300 dark:hover:bg-gray-600
                 transition-colors duration-200 ease-in-out
                 focus:outline-none"
      aria-label="Toggle dark mode"
    >
      {/* Switch Thumb */}
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full 
                   bg-white dark:bg-gray-800
                   shadow-sm border border-gray-200 dark:border-gray-600
                   transition-transform duration-200 ease-in-out
                   flex items-center justify-center
                   ${dark ? "translate-x-6" : "translate-x-0.5"}`}
      >
        {dark ? (
          <FaMoon className="text-gray-600 text-xs" />
        ) : (
          <FaSun className="text-gray-600 text-xs" />
        )}
      </div>
    </button>
  );
}
