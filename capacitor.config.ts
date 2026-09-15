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
    overrideUserAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
  android: {
    allowMixedContent: false,
    overrideUserAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  },
};

export default config;
