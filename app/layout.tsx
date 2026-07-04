import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Agentation } from "agentation";
import "@/lib/orpc.server";

// Inter is the primary UI typeface for the whole app.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fiilo — Let AI take your sales to the next level",
  description:
    "Unlock rapid growth by combining intelligent automation, real time insights and streamlined workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
      {process.env.NODE_ENV === "development" && <Agentation />}
    </html>
  );
}
