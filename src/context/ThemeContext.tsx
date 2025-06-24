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

  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement;
    html.classList.toggle("dark", newTheme === "dark");
    html.setAttribute("data-theme", newTheme);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", newTheme === "dark" ? "#0a0a0a" : "#ffffff");
    }
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme: Theme = savedTheme ?? (systemPrefersDark ? "dark" : "light");

      setTheme(initialTheme);
      applyTheme(initialTheme);

      if (!savedTheme) {
        localStorage.setItem("theme", initialTheme);
      }

      // 👂 Optionnel : écoute les changements système
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        const newSystemTheme = e.matches ? "dark" : "light";
        const saved = localStorage.getItem("theme");
        if (!saved) {
          setTheme(newSystemTheme);
          applyTheme(newSystemTheme);
        }
      };
      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) return null;

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
