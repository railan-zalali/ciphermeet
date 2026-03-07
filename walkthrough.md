# 🚀 Panduan Menjalankan CipherMeet

## Prasyarat

| Tool | Versi | Link |
|---|---|---|
| **Node.js** | 20+ | [nodejs.org](https://nodejs.org) |
| **Java JDK** | 17 | [adoptium.net](https://adoptium.net) |
| **Android Studio** | Latest | Untuk Android SDK & Emulator |
| **Docker Desktop** | Latest | [docker.com](https://docker.com) |

> [!IMPORTANT]
> Set `ANDROID_HOME` environment variable ke direktori Android SDK kamu, contoh: `C:\Users\USER\AppData\Local\Android\Sdk`

---

## 🗄️ Step 1 — Jalankan Database (Docker)

File `docker-compose.yml` berada di root folder proyek.

```bash
cd "c:\Railan\New folder\ciphermeet"
docker compose up -d
```

Verifikasi semua container berjalan:
```bash
docker compose ps
```

Harapan output:
```
NAME               STATUS      PORTS
ciphermeet_postgres running     0.0.0.0:5432->5432/tcp
ciphermeet_mongodb  running     0.0.0.0:27017->27017/tcp
ciphermeet_redis    running     0.0.0.0:6379->6379/tcp
```

---

## ⚙️ Step 2 — Setup Backend

```bash
cd "c:\Railan\New folder\ciphermeet\cipher-meet-backend"

# Install dependencies
npm install

# Salin dan konfigurasi .env
copy .env.example .env
```

**Edit `.env`** — Pastikan password sesuai dengan `docker-compose.yml`:
```env
POSTGRES_HOST=localhost
POSTGRES_USER=ciphermeet
POSTGRES_PASSWORD=ciphermeet_dev_password
POSTGRES_DB=ciphermeet
MONGODB_URI=mongodb://localhost:27017/ciphermeet_messages
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=my-super-secret-dev-key-change-in-prod
JWT_EXPIRES_IN=15m
```

**Jalankan backend:**
```bash
npm run start:dev
```

Backend berjalan di:
- **REST API**: `http://localhost:3000/api/v1`
- **Swagger Docs**: `http://localhost:3000/api/docs`
- **WebSocket**: `ws://localhost:3000/chat`

> **Catatan:** Backend sekarang mendengarkan di `0.0.0.0` sehingga bisa diakses dari device fisik.

---

## 📱 Step 3 — Setup Mobile App

```bash
cd "c:\Railan\New folder\ciphermeet\cipher-meet-mobile"

# Install dependencies
npm install
```

**Konfigurasi API URL:**

Edit file: `src/config/env.ts`

**Opsi A: Android Emulator** (Default)
Biarkan `API_BASE_URL` seperti default:
```typescript
export const API_BASE_URL = 'http://10.0.2.2:3000';
```

**Opsi B: Device Fisik** (USB Debugging)
Ganti `API_BASE_URL` dengan IP lokal komputer kamu (cek dengan `ipconfig`):
```typescript
export const API_BASE_URL = 'http://192.168.1.XXX:3000';
```

---

## 🤖 Step 4 — Jalankan di Android

### Opsi A: Android Emulator (Rekomendasi)

1. Buka Android Studio
2. Buka **AVD Manager** (Tools → Device Manager)
3. Buat emulator: **Pixel 7 Pro**, API **34** (Android 14)
4. Start emulator, tunggu sampai booting selesai

Kemudian jalankan:
```bash
# Terminal 1 (Metro bundler)
cd "c:\Railan\New folder\ciphermeet\cipher-meet-mobile"
npx react-native start

# Terminal 2 (build & install ke emulator)
npx react-native run-android
```

### Opsi B: Device Fisik (USB Debugging)

1. Aktifkan **Developer Options** di HP (ketuk Build Number 7x)
2. Aktifkan **USB Debugging**
3. Sambungkan dengan kabel USB
4. Verifikasi: `adb devices` (harus muncul device ID)
5. Pastikan HP dan Komputer berada di jaringan WiFi yang SAMA.
6. Pastikan `src/config/env.ts` sudah diupdate dengan IP komputer.

Jalankan:
```bash
npx react-native run-android
```

---

## 🔍 Troubleshooting Umum

| Error | Solusi |
|---|---|
| `ECONNREFUSED 5432` | Docker belum jalan → `docker compose up -d` |
| `Metro bundler: Unable to resolve module` | `npx react-native start --reset-cache` |
| `SDK location not found` | Set `ANDROID_HOME` di System Environment Variables |
| `Could not find avdmanager` | Install Android SDK Command-line Tools via Android Studio |
| `Error: Cannot find native module` | Pastikan menjalankan `npx react-native run-android` |
| Backend 401 di semua endpoint | Cek `JWT_SECRET` di `.env` backend sesuai |
| App tidak bisa connect ke backend (Device Fisik) | Cek Firewall Windows (Allow Node.js), pastikan IP benar, ping IP HP dari PC |

---

## 📋 Urutan Testing Flow

```
1. Buka app → Splash Screen → Onboarding
2. Daftar akun baru (Register)
3. Verifikasi OTP (cek terminal backend untuk OTP dev mode)
4. Isi Profile Wizard (5 langkah)
5. Discovery feed → swipe → match
6. Tab Aktivitas → lihat match
7. Buka Chat → kirim pesan
8. Tab Profil → Privacy / Security / Aksesibilitas
```
