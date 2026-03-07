# CipherMeet Mobile - Deployment & Physical Device Setup Guide

This guide provides step-by-step instructions to build, sign, and deploy the CipherMeet application to a physical Android device for testing and production usage.

## Prerequisites

- **OS:** Windows (Current Environment), macOS, or Linux.
- **Java JDK:** version 17 or newer (OpenJDK recommended).
- **Node.js:** version 18 or newer.
- **Android Studio:** Latest version installed with Android SDK.
- **Physical Device:** An Android phone with Android 8.0 (Oreo) or higher.
- **USB Cable:** High-quality data cable.

---

## 1. Environment Setup

### Install Android Studio & SDK
1. Download and install [Android Studio](https://developer.android.com/studio).
2. Open Android Studio -> **More Actions** -> **SDK Manager**.
3. Under **SDK Platforms**, check **Android 14.0 ("UpsideDownCake")** (API 34).
4. Under **SDK Tools**, check:
   - Android SDK Build-Tools
   - Android SDK Platform-Tools
   - Android Emulator
   - Google USB Driver (Windows only)
5. Add Android SDK to your Environment Variables (Windows):
   - Set `ANDROID_HOME` to `%LOCALAPPDATA%\Android\Sdk`.
   - Add `%ANDROID_HOME%\platform-tools` to your `Path`.

---

## 2. Prepare Your Physical Device

### Enable Developer Options
1. Go to **Settings** -> **About Phone**.
2. Tap **Build Number** 7 times rapidly until you see "You are now a developer!".

### Enable USB Debugging
1. Go to **Settings** -> **System** -> **Developer Options**.
2. Enable **USB debugging**.
3. Connect your phone to the PC via USB.
4. On your phone, a prompt "Allow USB debugging?" will appear. Check "Always allow from this computer" and tap **Allow**.

### Verify Connection
Open a terminal (PowerShell/CMD) and run:
```bash
adb devices
```
You should see your device ID followed by `device`. If it says `unauthorized`, check your phone screen again.

---

## 3. Build & Release Configuration

We have already configured the project for a signed release build.

### Signing Configuration (Completed)
- **Keystore:** `android/app/release.keystore` (Generated automatically).
- **Alias:** `ciphermeet`
- **Password:** `ciphermeet`
- **Gradle Config:** `android/app/build.gradle` has been updated to use this keystore for release builds.

### Generating the Release APK
Run the following commands in the `cipher-meet-mobile` directory:

```bash
# Clean previous builds
cd android
./gradlew clean

# Build Release APK
./gradlew assembleRelease
```

The APK will be generated at:
`android/app/build/outputs/apk/release/app-release.apk`

---

## 4. Install on Physical Device

To install the release build on your connected device:

```bash
# Make sure you are in the 'android' folder
./gradlew installRelease
```

Or manually using ADB:

```bash
adb install app/build/outputs/apk/release/app-release.apk
```

---

## 5. Troubleshooting Guide

### Device Not Detected
- **Issue:** `adb devices` shows empty list.
- **Fix:**
  1. Ensure "Google USB Driver" is installed in SDK Manager.
  2. Try a different USB cable (some are charge-only).
  3. Toggle "USB Debugging" off and on.
  4. Change USB mode on phone from "Charging" to "File Transfer (MTP)".

### Installation Failed (App Crash on Startup)
- **Issue:** App opens and closes immediately.
- **Fix:**
  1. We have added a global **ErrorBoundary** to catch crashes. Check if an error screen appears.
  2. Connect via USB and view logs:
     ```bash
     adb logcat *:E
     ```
  3. Ensure your PC and Phone are on the **same Wi-Fi network** if using local API/Socket servers.
  4. Update `src/config/env.ts` with your PC's local IP address (e.g., `192.168.1.x`) instead of `localhost`.

### Build Failed
- **Issue:** `./gradlew assembleRelease` fails.
- **Fix:**
  1. Run `./gradlew clean` first.
  2. Ensure JDK 17 is being used: `java -version`.
  3. Check internet connection (Gradle needs to download dependencies).

---

## 6. Running in Development Mode (Hot Reload)

To develop with hot reload on your physical device:

1. **Start Metro Bundler:**
   ```bash
   npm start
   ```

2. **Run on Device:**
   Open a second terminal:
   ```bash
   npm run android
   ```
   *Note: Ensure your device is connected via ADB.*

---

## Summary of Changes Made
- **Audit:** Fixed critical storage mismatch between API and Auth Store.
- **Security:** Unified secure storage implementation.
- **Performance:** Optimized `SwipeStack` and `ChatListScreen` with memoization.
- **Stability:** Added Global Error Boundary.
- **Release:** Configured `release.keystore` and Gradle signing.
