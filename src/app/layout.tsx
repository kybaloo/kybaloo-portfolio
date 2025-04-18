import type { Metadata } from "next";
import { Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navigation from "@/components/Navigation";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  weight: ['400', '500', '700'],
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: 'swap',
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
      <body
        className={`${poppins.variable} ${robotoMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <Navigation />
            <div className="pt-16">
              {children}
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
