import admin, { type App } from "firebase-admin";

let firebaseApp: App | null = null;

export function getFirebaseAdmin(): App | null {
  if (firebaseApp) return firebaseApp;

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccount) return null;

  try {
    if (!admin.apps.length) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount)),
      });
    } else {
      firebaseApp = admin.apps[0]!;
    }
    return firebaseApp;
  } catch {
    return null;
  }
}

export async function sendFCMPush(
  tokens: string[],
  payload: { title: string; body: string; url: string }
) {
  const app = getFirebaseAdmin();
  if (!app || tokens.length === 0) return;

  const messaging = admin.messaging(app);

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
