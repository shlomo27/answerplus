import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.aicrowd.app",
  appName: "AICrowd",
  // Points to the live Railway deployment — no static build needed
  server: {
    url: "https://answerplus-production.up.railway.app",
    cleartext: false,
  },
  ios: {
    contentInset: "automatic",
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
