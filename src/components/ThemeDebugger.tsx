"use client";

import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

const ThemeDebugger = () => {
  const { theme, toggleTheme } = useTheme();
  const [htmlClasses, setHtmlClasses] = useState<string>("");
  const [systemTheme, setSystemTheme] = useState<string>("");

  useEffect(() => {
    // Check HTML classes
    setHtmlClasses(document.documentElement.className);

    // Check system preference
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setSystemTheme(mediaQuery.matches ? "dark" : "light");
    }
  }, [theme]);

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 text-sm">
      <div className="mb-2">
        <strong>Theme Debug Info:</strong>
      </div>
      <div>
        Current Theme: <span className="font-mono">{theme}</span>
      </div>
      <div>
        System Preference: <span className="font-mono">{systemTheme}</span>
      </div>
      <div>
        HTML Classes: <span className="font-mono">{htmlClasses}</span>
      </div>
      <div>
        localStorage: <span className="font-mono">{typeof window !== "undefined" ? localStorage.getItem("theme") : "N/A"}</span>
      </div>
      <button onClick={toggleTheme} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs">
        Toggle Theme
      </button>
    </div>
  );
};

export default ThemeDebugger;
