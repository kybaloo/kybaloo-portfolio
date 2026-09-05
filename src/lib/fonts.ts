import {Inter, JetBrains_Mono, Newsreader} from 'next/font/google';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

/** Classes à poser sur <html> pour exposer les trois familles en CSS. */
export const fontVariables = `${newsreader.variable} ${inter.variable} ${jetbrainsMono.variable}`;
