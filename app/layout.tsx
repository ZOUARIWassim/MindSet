import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { SessionProviderWrapper } from "@/components/providers/SessionProviderWrapper";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { ToasterProvider } from "@/components/providers/ToasterProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: "MindSet",
  description: "Build the systems behind who you want to become.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
        <ToasterProvider />
      </body>
    </html>
  );
}
