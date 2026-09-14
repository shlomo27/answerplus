import { initializeApp, getApps, getApp, cert, type App } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

function getFirebaseApp(): App | null {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccount) return null;

  try {
    if (getApps().length === 0) {
      return initializeApp({ credential: cert(JSON.parse(serviceAccount)) });
    }
    return getApp();
  } catch {
    return null;
  }
}

export async function sendFCMPush(
  tokens: string[],
  payload: { title: string; body: string; url: string }
) {
  const app = getFirebaseApp();
  if (!app || tokens.length === 0) return;

  const messaging = getMessaging(app);

  await Promise.allSettled(
    tokens.map((token) =>
      messaging.send({
        token,
        notification: { title: payload.title, body: payload.body },
        data: { url: payload.url },
        android: { priority: "high" },
        apns: { payload: { aps: { sound: "default" } } },
      })
    )
  );
}
