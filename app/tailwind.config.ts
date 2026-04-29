import type { Config } from "tailwindcss";

/**
 * Pipeline · Design tokens (v1.6).
 *
 * Palette refresh aimed at the sensibility a senior Stripe / Apple designer
 * would bring: lighter, more breathable indigo as the lead accent (the dense
 * indigo-700 reads heavy at scale and at small sizes); a violet companion
 * for gradient depth; cool slate ink scale for editorial weight; refined
 * highlight + signal palette; richer shadow stack for tactile elevation.
 *
 * Motion: spring easing on interactive elements, refined durations. The
 * underlying editorial DNA (display serif, oldstyle figures, tabular metrics)
 * is unchanged.
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
          100: "#F1F5F9",
          50: "#F8FAFC"
        },
        paper: {
          DEFAULT: "#FAFBFC",
          50: "#FFFFFF",
          100: "#F4F6FA",
          200: "#E5EAF2",
          300: "#C5CDD8"
        },
        // Accent: breathable indigo (Tailwind indigo-500 family). The dense
        // indigo-700 we used to lead with now lives at .700 / .800 for
        // deep-mode surfaces and pressed states only.
        accent: {
          DEFAULT: "#6366F1",
          900: "#312E81",
          800: "#3730A3",
          700: "#4338CA",
          600: "#4F46E5",
          500: "#6366F1",
          400: "#818CF8",
          300: "#A5B4FC",
          200: "#C7D2FE",
          100: "#E0E7FF",
          50: "#EEF2FF"
        },
        // Violet: companion for the brand gradient + secondary energy.
        violet: {
          DEFAULT: "#8B5CF6",
          900: "#4C1D95",
          800: "#5B21B6",
          700: "#6D28D9",
          600: "#7C3AED",
          500: "#8B5CF6",
          400: "#A78BFA",
          300: "#C4B5FD",
          200: "#DDD6FE",
          100: "#EDE9FE",
          50: "#F5F3FF"
        },
        highlight: {
          DEFAULT: "#D97A1F",
          700: "#A0540F",
          600: "#B86417",
          500: "#D97A1F",
          400: "#EFA255",
          300: "#F4BD7E",
          200: "#FAD7A8",
          100: "#FCEACB",
          50: "#FEF6E8"
        },
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
          green: "#059669",
          "green-soft": "#D1FAE5",
          amber: "#D97706",
          "amber-soft": "#FEF3C7",
          red: "#DC2626",
          "red-soft": "#FEE2E2"
        },
        // Cyan accent for data-viz spark moments (rare).
        cyan: {
          DEFAULT: "#0891B2",
          500: "#06B6D4",
          200: "#A5F3FC",
          100: "#CFFAFE"
        },
        teal: {
          DEFAULT: "#0E9384",
          700: "#0A6E63",
          600: "#0C8377",
          500: "#0E9384",
          400: "#3DB1A4",
          300: "#7FCDC2",
          200: "#B8E3DD",
          100: "#DEF2EF",
          50: "#EEF8F6"
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
        30: "7.5rem",
        "section":   "5.5rem",
        "section-lg":"7rem"
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
          "0 0 0 2px rgb(250 251 252 / 1), 0 0 0 4px rgb(99 102 241 / 0.45)",
        ring: "inset 0 0 0 1px rgb(11 18 32 / 0.08)",
        // Soft accent halo on primary CTAs. Indigo-500 tinted, not the heavier 700.
        glow: "0 1px 0 0 rgb(255 255 255 / 0.10) inset, 0 12px 32px -10px rgb(99 102 241 / 0.45)",
        "glow-soft": "0 8px 22px -10px rgb(99 102 241 / 0.34)",
        // Deeper press shadow (used on .card-interactive active state)
        press: "0 1px 0 0 rgb(11 18 32 / 0.06), 0 1px 4px -1px rgb(11 18 32 / 0.10)"
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
        emphasized: "cubic-bezier(0.2, 0, 0, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        gentle: "cubic-bezier(0.4, 0, 0.2, 1)"
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
        },
        "shimmer-text": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        }
      },
      animation: {
        "fade-in": "fade-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "rise-in": "rise-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-in": "scale-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "ticker": "ticker 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "shimmer": "shimmer 2.4s linear infinite",
        "pulse-dot": "pulse-dot 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite",
        "draw-line": "draw-line 1200ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "shimmer-text": "shimmer-text 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
