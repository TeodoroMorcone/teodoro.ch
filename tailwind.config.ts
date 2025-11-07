import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{md,mdx,json}",
  ],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2rem",
        "2xl": "2.5rem",
      },
    },
    extend: {
      colors: {
        primary: "#008585",
        "primary-strong": "#006B6B",
        secondary: "#0F5B4B",
        "secondary-strong": "#0A3F35",
        accent: "#C45335",
        "accent-foreground": "#FFFFFF",
        "accent-muted": "#FFECCD",
        surface: "#FFF1D6",
        "surface-contrast": "#F7E6C3",
      },
      borderRadius: {
        xl: "1.25rem",
      },
      boxShadow: {
        sidebar: "0 12px 40px rgba(25, 24, 59, 0.1)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "\"Segoe UI\"",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      transitionTimingFunction: {
        "soft-sine": "cubic-bezier(0.39, 0.575, 0.565, 1)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};
export default config;
