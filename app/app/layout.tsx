import "./globals.css";
import type { Metadata } from "next";
import { Manrope, JetBrains_Mono, Fraunces } from "next/font/google";
import { Toolbar } from "@/components/chrome/Toolbar";
import { Footer } from "@/components/chrome/Footer";
import { CommandPalette } from "@/components/chrome/CommandPalette";
import { Toaster } from "@/components/chrome/Toaster";

/**
 * Editorial pairing.
 *
 * Fraunces. display + italic. Variable, optical-sizing aware. Used for
 * headlines, metrics, and the in-app numeric voice. Drives `opsz` by
 * font-size automatically; `SOFT` tuned softer for warm editorial feel.
 *
 * Manrope. body sans. Variable, modern humanist; spaced for prose but
 * narrow enough for dense UI. Deliberately not Inter / system default.
 *
 * JetBrains Mono. used sparingly for keyboard shortcuts, draft bodies,
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
  title: "Pipeline. The job search that runs itself.",
  description:
    "An AI chief of staff for your job search. Nine specialised agents target opportunities, draft outreach in your voice, send from your inbox, handle follow ups, and book meetings. You approve every move. About ten minutes a day. The rest runs in the background.",
  metadataBase: new URL("https://pipeline1-sigma.vercel.app")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col bg-paper text-ink antialiased">
        <Toolbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CommandPalette />
        <Toaster />
      </body>
    </html>
  );
}
