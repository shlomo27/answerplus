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
    if (!session.user.onboarded) {
      router.push("/onboarding");
    }
  }, [status, session, pathname, router]);

  return null;
}
