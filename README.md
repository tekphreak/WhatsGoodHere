# WhatsGoodHere

> Crowdsourced venue tips — find out what's actually good before you go.

WhatsGoodHere lets users discover and share what's worth ordering, trying, or skipping at any nearby venue. Restaurants, bars, cafes, parks, shops — real recommendations from people who've actually been there.

---

## Features

- **Nearby Map** — See rated venues on a live Google Map around your location
- **Search** — Find venues anywhere using Google Places autocomplete
- **Star Ratings** — 1–5 star crowd-sourced ratings per venue
- **Photo Reviews** — Upload photos directly from your camera or gallery
- **User Accounts** — Sign up/in with email, track your own reviews
- **Dark Mode** — Supports system light/dark theme

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.76 + Expo SDK 52 |
| Navigation | Expo Router (file-based) |
| Backend | Firebase (Firestore, Auth, Storage) |
| Maps | React Native Maps (Google Maps) |
| Ads | Google AdMob |
| State | Zustand + TanStack Query |
| Animation | Reanimated 3 |
| UI | React Native Paper + Expo Vector Icons |
| Build | Gradle 9.0 / Java 17 / Hermes JS engine |
| Android Arch | arm64-v8a, armeabi-v7a, x86, x86_64 |

---

## Project Structure

```
WhatsGoodHere/
├── app/                        # Expo Router screens
│   ├── _layout.tsx             # Root layout (providers, auth listener)
│   ├── index.tsx               # Entry redirect (auth check)
│   ├── (auth)/
│   │   └── index.tsx           # Login / Sign Up
│   ├── (tabs)/
│   │   ├── index.tsx           # Nearby — map + venue list
│   │   ├── search.tsx          # Search by location
│   │   └── profile.tsx         # User profile
│   └── venue/
│       ├── [id].tsx            # Venue detail + reviews
│       └── add-review.tsx      # Submit a review (modal)
├── src/
│   ├── types/index.ts          # Venue, Review, User types
│   ├── services/
│   │   ├── firebase.ts         # Firebase app init
│   │   └── venues.ts           # Firestore CRUD
│   ├── store/auth.ts           # Zustand auth store
│   ├── hooks/useLocation.ts    # Location permission + coords
│   └── components/
│       ├── VenueCard.tsx
│       └── ReviewCard.tsx
├── android/                    # Native Android (Expo bare workflow)
├── assets/images/              # Icons, splash screen
├── app.json                    # Expo config
├── eas.json                    # EAS Build profiles
└── .env.example                # Required environment variables
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Java 17 (Temurin recommended)
- Android SDK (API 35, build-tools 35.0.0)
- A Firebase project
- Google Maps API key
- Google AdMob App ID

### Setup

```bash
git clone https://github.com/tekphreak/WhatsGoodHere.git
cd WhatsGoodHere
npm install --legacy-peer-deps
```

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
```

Place your `google-services.json` (Firebase Android config) in the project root.

### Run (Expo Dev Client)

```bash
npx expo start
```

### Build APK Locally

```bash
export ANDROID_HOME=~/Android/Sdk
export JAVA_HOME=/path/to/jdk17

android/gradlew -p android assembleRelease --no-daemon
# Output: android/app/build/outputs/apk/release/app-release.apk
```

### Build via EAS (Cloud)

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

---

## Android Permissions

| Permission | Purpose |
|---|---|
| `ACCESS_FINE_LOCATION` | Show venues near your exact location |
| `ACCESS_COARSE_LOCATION` | Fallback location for venue discovery |
| `CAMERA` | Take venue photos for reviews |
| `READ/WRITE_EXTERNAL_STORAGE` | Access photo library (Android ≤ 12) |
| `RECORD_AUDIO` | In-app audio (future feature) |
| `INTERNET` | Fetch venue and review data |
| `VIBRATE` | Haptic feedback |

---

## App Info

| Field | Value |
|---|---|
| Package | `com.tekphreak.whatsgoodhere` |
| Version | 1.0.1 (versionCode 2) |
| Min SDK | API 24 (Android 7.0) |
| Target SDK | API 34 |
| New Architecture | Enabled (Fabric / TurboModules) |
| JS Engine | Hermes |

---

## Developer

Built by [Tekphreak](https://github.com/tekphreak)
