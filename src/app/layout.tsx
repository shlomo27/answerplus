import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Qrowd – שאל AI וקהילה",
  description: "שאל AI וקהילה - קבל את התשובה הטובה ביותר",
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
        <SessionProvider>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-5">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
