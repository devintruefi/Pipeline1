import "./globals.css";
import type { Metadata } from "next";
import { Manrope, JetBrains_Mono, Fraunces } from "next/font/google";
import { Toolbar } from "@/components/chrome/Toolbar";
import { Footer } from "@/components/chrome/Footer";
import { CommandPalette } from "@/components/chrome/CommandPalette";

/**
 * Editorial pairing.
 *
 * Fraunces — display + italic. Variable, optical-sizing aware. Used for
 * headlines, metrics, and the in-app numeric voice. Drives `opsz` by
 * font-size automatically; `SOFT` tuned softer for warm editorial feel.
 *
 * Manrope — body sans. Variable, modern humanist; spaced for prose but
 * narrow enough for dense UI. Deliberately not Inter / system default.
 *
 * JetBrains Mono — used sparingly for keyboard shortcuts, draft bodies,
 * and run-log payloads. High legibility at small sizes.
 */
const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  display: "swap"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Pipeline — The autonomous executive job search.",
  description:
    "An AI chief of staff that runs an entire executive job search end-to-end — researching opportunities, drafting thesis-grounded outreach in your voice, sending it from your inbox, handling follow-ups, and putting meetings on your calendar.",
  metadataBase: new URL("http://localhost:3000")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col bg-paper text-ink antialiased">
        <Toolbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CommandPalette />
      </body>
    </html>
  );
}
