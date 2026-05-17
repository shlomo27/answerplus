import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AnswerPlus – השוואת AI",
  description: "שאל שאלה וקבל תשובות מ-Claude, ChatGPT וGemini בבת אחת",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-5">{children}</main>
      </body>
    </html>
  );
}
