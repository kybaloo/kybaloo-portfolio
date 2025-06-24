/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["class", 'html[class~="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-roboto-mono)", "monospace"],
        heading: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          dark: "var(--secondary-dark)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          dark: "var(--accent-dark)",
        },
      },
    },
  },
  plugins: [],
  important: true, // Force Tailwind classes to have higher specificity
};
