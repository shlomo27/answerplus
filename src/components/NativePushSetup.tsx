"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function NativePushSetup() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) return;

    async function setup() {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;

        const { PushNotifications } = await import("@capacitor/push-notifications");

        const permResult = await PushNotifications.requestPermissions();
        if (permResult.receive !== "granted") return;

        await PushNotifications.register();

        PushNotifications.addListener("registration", async (token) => {
          const platform = Capacitor.getPlatform();
          await fetch("/api/push/register-device", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ token: token.value, platform }),
          });
        });
      } catch {
        // not running in Capacitor native context
      }
    }

    setup();
  }, [session?.user]);

  return null;
}
