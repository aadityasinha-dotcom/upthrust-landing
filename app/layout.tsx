import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

// next/font downloads the fonts at build time and self-hosts them: no request to
// Google at runtime, no layout shift (size-adjusted fallback), display: swap.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-inter",
});

// Anton only ships one weight (400). Used for the display pieces: header CTA,
// hero headline, footer wordmark.
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-anton",
});

// Placeholder until Phase 6 (SEO) fills this from the CMS.
export const metadata: Metadata = {
  title: "Upthrust",
  description: "Bold design that performs.",
};

// GTM is the only third-party script. @next/third-parties injects it after
// hydration so it never competes with the page's own loading. No ID = no script.
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable} h-full antialiased`}>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
