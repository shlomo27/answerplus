import webpush from "web-push";
import { prisma } from "./prisma";
import { sendFCMPush } from "./firebase-admin";

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:admin@aicrowd.app",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; url: string }
) {
  // Web push (browser)
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    const subs = await prisma.pushSubscription.findMany({ where: { userId } });
    await Promise.allSettled(
      subs.map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            JSON.stringify(payload)
          );
        } catch (err) {
          if ((err as { statusCode?: number }).statusCode === 410) {
            await prisma.pushSubscription.delete({ where: { endpoint: sub.endpoint } }).catch(() => {});
          }
        }
      })
    );
  }

  // FCM push (native app — Android + iOS)
  const deviceTokens = await prisma.deviceToken.findMany({ where: { userId } });
  if (deviceTokens.length > 0) {
    await sendFCMPush(deviceTokens.map((d) => d.token), payload);
  }
}
