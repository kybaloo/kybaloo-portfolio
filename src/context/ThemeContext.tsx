"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme and ensure it overrides system preferences
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme | null;

      if (savedTheme) {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } else {
        // Default to light mode regardless of system preference
        setTheme("light");
        applyTheme("light");
        localStorage.setItem("theme", "light");
      }
    }
  }, []);
  const applyTheme = (newTheme: Theme) => {
    const htmlElement = document.documentElement;

    // For Tailwind CSS dark mode, we only need to add/remove the 'dark' class
    if (newTheme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      // For light mode, just remove the dark class
      htmlElement.classList.remove("dark");
    }

    // Ensure the meta theme-color is updated
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", newTheme === "dark" ? "#0a0a0a" : "#ffffff");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Save to localStorage
    localStorage.setItem("theme", newTheme);

    // Apply theme with our custom function
    applyTheme(newTheme);
  };
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
