import type { Config } from "tailwindcss";

/**
 * Pipeline · Design tokens.
 *
 * Color values are tuned in OKLCH then committed as hex for browser-wide
 * fidelity. The palette is warm-tinted on the neutral axis (paper / ink),
 * with one editorial accent (orange-red) and one cool secondary (slate-blue)
 * used for data viz and informational UI. Signal colors are reserved for
 * status (green / amber / red) and never used decoratively.
 *
 * Type, motion, and spacing tokens live alongside color so the system reads
 * as a single document. Anything not in this file should not appear in the UI.
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
        // Warm-tinted ink (oklch ~15% L, +y hue)
        ink: {
          DEFAULT: "#0E0E10",
          950: "#0A0A0C",
          900: "#111114",
          800: "#1B1B1F",
          700: "#2A2A30",
          600: "#3D3D45",
          500: "#5C5C66",
          400: "#7A7A85",
          300: "#9B9BA5",
          200: "#C5C5CC",
          100: "#E2E2E6",
          50: "#EFEFF1"
        },
        // Warm cream paper (oklch ~98% L, slight +y)
        paper: {
          DEFAULT: "#FBFAF6",
          50: "#FDFCFA",
          100: "#F5F3EC",
          200: "#EBE8DE",
          300: "#DDD9CB"
        },
        // Editorial accent (oklch ~63% L, hue ~35)
        accent: {
          DEFAULT: "#D8451F",
          700: "#A62E11",
          600: "#B23818",
          500: "#D8451F",
          400: "#E36648",
          300: "#EE9379",
          200: "#F6C2B2",
          100: "#FBE2D7",
          50: "#FDF1EB"
        },
        // Cool secondary (slate-blue) for data + informational UI
        cool: {
          DEFAULT: "#3B5973",
          700: "#22384C",
          600: "#2D4A63",
          500: "#3B5973",
          400: "#5A7892",
          300: "#8198AE",
          200: "#B3C2D0",
          100: "#D9E0E8",
          50: "#EDF1F5"
        },
        signal: {
          green: "#1F7A3A",
          "green-soft": "#E5F1E8",
          amber: "#B07A1A",
          "amber-soft": "#F6ECD7",
          red: "#B33028",
          "red-soft": "#F4DDDB"
        }
      },
      fontFamily: {
        // Wired up in app/layout.tsx via next/font (Geist + Fraunces + Geist Mono)
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        serif: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      fontSize: {
        // Modular scale — 1.125 ratio at body, 1.250 at display
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
      // Extend the opacity scale so editorial values (8, 12, etc.) flow
      // through the slash modifier (e.g. `border-ink/8`).
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
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "18px",
        "2xl": "24px"
      },
      boxShadow: {
        // Subtle, warm-tinted shadows — never neutral gray
        editorial:
          "0 1px 0 0 rgb(14 14 16 / 0.04), 0 18px 36px -22px rgb(14 14 16 / 0.18)",
        card: "0 1px 0 0 rgb(14 14 16 / 0.03), 0 4px 14px -8px rgb(14 14 16 / 0.10)",
        lift: "0 1px 0 0 rgb(14 14 16 / 0.04), 0 22px 50px -28px rgb(14 14 16 / 0.22)",
        focus:
          "0 0 0 2px rgb(251 250 246 / 1), 0 0 0 4px rgb(216 69 31 / 0.55)",
        ring: "inset 0 0 0 1px rgb(14 14 16 / 0.08)"
      },
      transitionTimingFunction: {
        // Curated easings — no bounce, no elastic.
        out: "cubic-bezier(0.22, 1, 0.36, 1)",       // out-quart
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)", // out-expo
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",   // in-out-cubic
        emphasized: "cubic-bezier(0.2, 0, 0, 1)"      // material emphasized
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
