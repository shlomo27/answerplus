"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PushSetup() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) return;

    async function setup() {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;

        const existing = await reg.pushManager.getSubscription();
        if (existing) return;

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidKey,
        });

        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(sub.toJSON()),
        });
      } catch {
        // silently ignore — push not supported or blocked
      }
    }

    setup();
  }, [session?.user]);

  return null;
}
