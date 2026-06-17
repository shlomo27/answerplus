# Mobile App Build Guide — Qrowd

## Quick Install (PWA)
Users can install directly from the browser (no app store needed):
1. Open the app in Safari (iOS) or Chrome (Android)
2. Tap "Share" → "Add to Home Screen"

## App Store / Google Play (Capacitor)

### Prerequisites
- macOS with Xcode 15+ (iOS)
- Android Studio (Android)
- Apple Developer Account ($99/year) → https://developer.apple.com
- Google Play Developer Account ($25 one-time) → https://play.google.com/console

### Setup (run once on your Mac)
```bash
git clone <repo>
cd answerplus
npm install
npx cap add ios        # adds ios/ folder
npx cap add android    # adds android/ folder
npx cap sync           # copies web assets
```

### Build iOS
```bash
npm run cap:ios        # opens Xcode
# In Xcode: select your team, set bundle ID (com.qrowd.app), Archive & Submit
```

### Build Android
```bash
npm run cap:android    # opens Android Studio
# In Android Studio: Build → Generate Signed Bundle → upload to Play Console
```

### After every web update
```bash
npx cap sync           # re-syncs web changes to native projects
```
