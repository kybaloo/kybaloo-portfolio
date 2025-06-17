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
                  
                  // Remove dark class first
                  htmlElement.classList.remove('dark');
                  
                  if (theme === 'dark') {
                    htmlElement.classList.add('dark');
                  }
                  // For light mode, we don't add any class (Tailwind default)
                  // Save light as default if no theme is set
                  if (!theme) {
                    localStorage.setItem('theme', 'light');
                  }
                } catch (e) {
                  // Fallback: remove dark class to default to light mode
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${robotoMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
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
