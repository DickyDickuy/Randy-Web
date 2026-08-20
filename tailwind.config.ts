import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-lato)", "Lato", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
        playfair: ["var(--font-playfair)", "Playfair Display", "serif"],
        lato: ["var(--font-lato)", "Lato", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
