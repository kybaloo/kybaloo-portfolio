"use client";

import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="p-2 transition-colors duration-300 bg-gray-200 rounded-full dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 hover:scale-110"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400 hover:text-yellow-300 transition-colors" />
      ) : (
        <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-colors" />
      )}
    </button>
  );
}
