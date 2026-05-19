"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function OnboardingGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const checked = useRef(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (pathname === "/onboarding") return;
    if (checked.current) return;
    if (sessionStorage.getItem("onboardingDone") === "1") {
      sessionStorage.removeItem("onboardingDone");
      return;
    }

    // Always verify against DB — session JWT may be stale across devices
    checked.current = true;
    fetch("/api/user/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.onboarded) {
          router.push("/onboarding");
        }
      })
      .catch(() => {
        // Fallback to session value if API fails
        if (!session.user.onboarded) {
          router.push("/onboarding");
        }
      });
  }, [status, session, pathname, router]);

  return null;
}
