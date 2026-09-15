import admin from "firebase-admin";

let app: admin.app.App | null = null;

export function getFirebaseAdmin(): admin.app.App | null {
  if (app) return app;

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccount) return null;

  try {
    if (!admin.apps.length) {
      app = admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount)),
      });
    } else {
      app = admin.apps[0]!;
    }
    return app;
  } catch {
    return null;
  }
}

export async function sendFCMPush(
  tokens: string[],
  payload: { title: string; body: string; url: string }
) {
  const firebaseApp = getFirebaseAdmin();
  if (!firebaseApp || tokens.length === 0) return;

  const messaging = admin.messaging(firebaseApp);

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
