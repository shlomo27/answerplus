// v2
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/components/SessionProvider";
import { LangProvider } from "@/components/LangProvider";
import OnboardingGuard from "@/components/OnboardingGuard";
import { headers } from "next/headers";
import type { Lang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Qrowd",
  description: "Ask AI and community — get the best answer",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Qrowd",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";
  const isHebrew =
    acceptLanguage.startsWith("he") ||
    acceptLanguage.includes(",he") ||
    acceptLanguage.includes(";he");
  const defaultLang: Lang = isHebrew ? "he" : "en";
  const dir = defaultLang === "he" ? "rtl" : "ltr";

  return (
    <html lang={defaultLang} dir={dir}>
      <body>
        <SessionProvider>
          <LangProvider initialLang={defaultLang}>
            <OnboardingGuard />
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-5">{children}</main>
          </LangProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
