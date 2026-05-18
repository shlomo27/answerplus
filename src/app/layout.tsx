import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/components/SessionProvider";
import { LangProvider } from "@/components/LangProvider";
import { headers } from "next/headers";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Server-side language detection via Accept-Language header
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";
  const isHebrew = acceptLanguage.startsWith("he") || acceptLanguage.includes(",he") || acceptLanguage.includes(";he");
  // Default to Hebrew for this app, switch to English only if browser explicitly prefers English first
  const defaultLang = acceptLanguage && !isHebrew && acceptLanguage.startsWith("en") ? "en" : "he";
  const dir = defaultLang === "he" ? "rtl" : "ltr";

  return (
    <html lang={defaultLang} dir={dir}>
      <body>
        <SessionProvider>
          <LangProvider>
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-5">{children}</main>
          </LangProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
