import type { Metadata } from "next";
import { Figtree, Instrument_Serif } from "next/font/google";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkBrief - AI Link Summarizer",
  description:
    "LinkBrief is an AI-Powered link summarizer that helps you to quickly analyze page content.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} h-full antialiased`}
      >
        {children}
      </body>
    </html>
  );
}