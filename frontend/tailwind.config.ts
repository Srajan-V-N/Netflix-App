import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: "#E50914",
          dark: "#141414",
          black: "#000000",
          gray: "#808080",
          lightgray: "#B3B3B3",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fadeIn 0.5s ease forwards",
        ripple: "ripple 0.6s linear",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        ripple: {
          to: { transform: "scale(4)", opacity: "0" },
        },
      },
      backgroundImage: {
        "gradient-netflix":
          "linear-gradient(to right, #141414, #1a1a1a, #141414)",
      },
    },
  },
  plugins: [],
};

export default config;
