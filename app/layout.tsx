import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProviderWrapper } from "@/components/providers/SessionProviderWrapper";
import { ThemeScript } from "@/components/theme/ThemeScript";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
