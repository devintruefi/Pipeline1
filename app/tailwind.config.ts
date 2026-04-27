import type { Config } from "tailwindcss";

/**
 * Pipeline · Design tokens.
 *
 * The palette is cool-tinted on the neutral axis (paper / ink) — premium,
 * professional, calm. One editorial accent (deep navy) carries the brand;
 * one warm secondary (amber gold) is reserved for high-importance moments.
 * Signal colors stay reserved for status (green / amber / red) and never
 * appear decoratively.
 *
 * The serif display family + tabular figures + generous spacing carry the
 * editorial DNA forward. Color is the only thing being refreshed.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Cool ink — near-black with a subtle blue undertone
        ink: {
          DEFAULT: "#0B1220",
          950: "#070A14",
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
          600: "#475569",
          500: "#64748B",
          400: "#94A3B8",
          300: "#CBD5E1",
          200: "#E2E8F0",
          100: "#EDF1F6",
          50: "#F4F6FA"
        },
        // Cool paper — clean near-white that reads premium, not yellow
        paper: {
          DEFAULT: "#FAFBFC",
          50: "#FFFFFF",
          100: "#F1F4F8",
          200: "#E3E8EE",
          300: "#C5CDD8"
        },
        // Editorial accent — deep navy, calm and unmistakably professional
        accent: {
          DEFAULT: "#1E40AF",
          700: "#15287E",
          600: "#1A36A0",
          500: "#1E40AF",
          400: "#2E55C8",
          300: "#5C7BD6",
          200: "#A6B7E0",
          100: "#DDE4F4",
          50: "#EEF2FA"
        },
        // Warm amber highlight — used sparingly for "this matters now" moments
        highlight: {
          DEFAULT: "#B5701A",
          700: "#8A540F",
          600: "#A06314",
          500: "#B5701A",
          400: "#D08D2C",
          300: "#E0AB42",
          200: "#EFCD7E",
          100: "#F8E6BB",
          50: "#FCF5E5"
        },
        // Cool secondary — refined slate, used in data viz + informational UI
        cool: {
          DEFAULT: "#475569",
          700: "#334155",
          600: "#3F4E63",
          500: "#475569",
          400: "#64748B",
          300: "#94A3B8",
          200: "#CBD5E1",
          100: "#E2E8F0",
          50: "#F1F5F9"
        },
        signal: {
          green: "#047857",
          "green-soft": "#D1FAE5",
          amber: "#B45309",
          "amber-soft": "#FEF3C7",
          red: "#B91C1C",
          "red-soft": "#FEE2E2"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        serif: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      fontSize: {
        "2xs": ["10.5px", { lineHeight: "1.4", letterSpacing: "0.04em" }],
        xs: ["12px", { lineHeight: "1.5" }],
        sm: ["13.5px", { lineHeight: "1.55" }],
        base: ["15px", { lineHeight: "1.6" }],
        lg: ["17px", { lineHeight: "1.55" }],
        xl: ["20px", { lineHeight: "1.4" }],
        "2xl": ["24px", { lineHeight: "1.3", letterSpacing: "-0.012em" }],
        "3xl": ["30px", { lineHeight: "1.2", letterSpacing: "-0.018em" }],
        "4xl": ["38px", { lineHeight: "1.1", letterSpacing: "-0.022em" }],
        "5xl": ["48px", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "6xl": ["64px", { lineHeight: "1.0", letterSpacing: "-0.028em" }],
        "7xl": ["88px", { lineHeight: "0.96", letterSpacing: "-0.032em" }],
        "8xl": ["120px", { lineHeight: "0.92", letterSpacing: "-0.036em" }]
      },
      letterSpacing: {
        tightish: "-0.012em",
        tighter: "-0.022em",
        tightest: "-0.032em",
        eyebrow: "0.18em"
      },
      spacing: {
        "px-half": "0.5px",
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem"
      },
      opacity: {
        4: "0.04",
        6: "0.06",
        8: "0.08",
        12: "0.12",
        14: "0.14",
        18: "0.18",
        22: "0.22",
        85: "0.85"
      },
      maxWidth: {
        prose: "62ch",
        page: "1240px",
        "page-wide": "1440px"
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "10px",
        lg: "14px",
        xl: "20px",
        "2xl": "26px"
      },
      boxShadow: {
        editorial:
          "0 1px 0 0 rgb(11 18 32 / 0.04), 0 18px 36px -22px rgb(11 18 32 / 0.18)",
        card: "0 1px 0 0 rgb(11 18 32 / 0.03), 0 4px 14px -8px rgb(11 18 32 / 0.10)",
        lift: "0 1px 0 0 rgb(11 18 32 / 0.04), 0 22px 50px -28px rgb(11 18 32 / 0.22)",
        focus:
          "0 0 0 2px rgb(250 251 252 / 1), 0 0 0 4px rgb(30 58 138 / 0.55)",
        ring: "inset 0 0 0 1px rgb(11 18 32 / 0.08)"
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
        emphasized: "cubic-bezier(0.2, 0, 0, 1)"
      },
      transitionDuration: {
        instant: "80ms",
        fast: "140ms",
        DEFAULT: "200ms",
        smooth: "320ms",
        slow: "520ms",
        "slow-2": "780ms"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        "ticker": {
          "0%": { opacity: "0", transform: "translateY(40%)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "pulse-dot": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.4)", opacity: "0.6" }
        },
        "draw-line": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" }
        }
      },
      animation: {
        "fade-in": "fade-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "rise-in": "rise-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-in": "scale-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "ticker": "ticker 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "shimmer": "shimmer 2.4s linear infinite",
        "pulse-dot": "pulse-dot 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite",
        "draw-line": "draw-line 1200ms cubic-bezier(0.22, 1, 0.36, 1) both"
      }
    }
  },
  plugins: []
};

export default config;
