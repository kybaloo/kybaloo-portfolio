import Navigation from "@/components/Navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import type { Metadata } from "next";
import { Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  weight: ["400", "500", "700"],
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TCHANGAI Florentin Kybaloo | Developer Portfolio",
  description: "A unique, developer-centric portfolio showcasing skills and projects",
  keywords: ["developer", "portfolio", "web development", "frontend", "backend", "full-stack"],
  authors: [{ name: "TCHANGAI Florentin Kybaloo" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {" "}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var htmlElement = document.documentElement;
                  var bodyElement = document.body;
                  
                  // Remove any existing theme classes first
                  htmlElement.classList.remove('dark', 'light');
                  if (bodyElement) bodyElement.classList.remove('dark', 'light');
                  
                  // If no stored theme, check system preference
                  if (!theme) {
                    var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    theme = systemPrefersDark ? 'dark' : 'light';
                    localStorage.setItem('theme', theme);
                  }
                  
                  // Apply the theme to both html and body
                  htmlElement.classList.add(theme);
                  if (bodyElement) bodyElement.classList.add(theme);
                  htmlElement.setAttribute('data-theme', theme);
                  
                  // Force style properties
                  if (theme === 'dark') {
                    htmlElement.style.setProperty('--background', '#0a0a0a');
                    htmlElement.style.setProperty('--foreground', '#ededed');
                    htmlElement.style.colorScheme = 'dark';
                  } else {
                    htmlElement.style.setProperty('--background', '#ffffff');
                    htmlElement.style.setProperty('--foreground', '#171717');
                    htmlElement.style.colorScheme = 'light';
                  }
                  
                  // Update meta theme-color
                  var metaThemeColor = document.querySelector('meta[name="theme-color"]');
                  if (metaThemeColor) {
                    metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
                  }
                } catch (e) {
                  // Fallback: apply light theme
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                  if (document.body) {
                    document.body.classList.remove('dark');
                    document.body.classList.add('light');
                  }
                }
              })();
            `,
          }}
        />
      </head>{" "}
      <body
        className={`${poppins.variable} ${robotoMono.variable} antialiased transition-colors duration-300`}
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <ThemeProvider>
          <LanguageProvider>
            <Navigation />
            <div className="pt-16">{children}</div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
