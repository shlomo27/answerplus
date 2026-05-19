"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (pathname === "/onboarding") return;
    // Skip redirect if user just finished onboarding (session hasn't refreshed yet)
    if (sessionStorage.getItem("onboardingDone") === "1") {
      sessionStorage.removeItem("onboardingDone");
      return;
    }
    if (!session.user.onboarded) {
      router.push("/onboarding");
    }
  }, [status, session, pathname, router]);

  return null;
}
