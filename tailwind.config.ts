import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Channels driven by CSS variables in index.css.
        // They flip automatically with prefers-color-scheme (system theme).
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)", // primary text (also subtle bg via ink/NN)
          muted: "rgb(var(--ink-muted) / <alpha-value>)", // secondary text
          faint: "rgb(var(--ink-faint) / <alpha-value>)", // tertiary text
        },
        paper: {
          DEFAULT: "rgb(var(--paper) / <alpha-value>)", // page background
          raised: "rgb(var(--paper-raised) / <alpha-value>)", // cards / surfaces
          line: "rgb(var(--paper-line) / <alpha-value>)", // borders / hairlines
        },
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)", // orange accent
          deep: "rgb(var(--brand-deep) / <alpha-value>)", // hover
          soft: "rgb(var(--brand-soft) / <alpha-value>)", // text on tint
        },
        ok: "rgb(var(--ok) / <alpha-value>)", // collected / departed / valid
        alert: "rgb(var(--alert) / <alpha-value>)", // blacklist / invalid
      },
      borderRadius: {
        lg: "0.625rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.08)",
        pop: "0 10px 30px rgba(16,24,40,0.12)",
      },
      keyframes: {
        "pop-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
