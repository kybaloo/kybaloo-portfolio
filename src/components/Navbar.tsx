"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { Language, useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navLinks = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.about, path: "/#about" },
    { name: t.nav.experience, path: "/#experience" },
    { name: t.nav.skills, path: "/#skills" },
    { name: t.nav.projects, path: "/#projects" },
    { name: t.nav.contact, path: "/#contact" },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };
  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
              &lt;TCHANGAI Kybaloo /&gt;
            </span>
          </Link>{" "}
          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-6 md:flex">
            {" "}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm font-medium transition-all duration-200 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-105 ${
                  pathname === link.path ? "text-blue-500" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {/* Theme Toggle */}
            <ThemeToggle />
            {/* Language Toggle */}
            <div className="flex items-center p-1 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
              {" "}
              <button
                onClick={() => handleLanguageChange("en")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                  language === "en"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                EN
              </button>{" "}
              <button
                onClick={() => handleLanguageChange("fr")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                  language === "fr"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                FR
              </button>
            </div>
          </nav>
          {/* Mobile Navigation Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
            {/* Theme Toggle - Mobile */}
            <ThemeToggle />

            <button className="flex items-center" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="py-4 md:hidden animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`text-sm font-medium transition-all duration-200 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-105 ${
                    pathname === link.path ? "text-blue-500" : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* Language Toggle - Mobile */}
              <div className="flex pt-2 space-x-2">
                <button
                  onClick={() => {
                    handleLanguageChange("en");
                    setIsMenuOpen(false);
                  }}
                  className={`px-2 py-1 text-xs font-medium rounded ${language === "en" ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"}`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    handleLanguageChange("fr");
                    setIsMenuOpen(false);
                  }}
                  className={`px-2 py-1 text-xs font-medium rounded ${language === "fr" ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"}`}
                >
                  Français
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
