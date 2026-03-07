# Tutorial: Menjalankan Project di Android Studio & Debugging

Panduan ini akan membantu Anda membuka project di Android Studio, menjalankannya di emulator/device fisik, dan menggunakan fitur Log Viewer yang baru ditambahkan untuk debugging.

## 1. Persiapan Awal (Prerequisites)

Pastikan Anda sudah menginstall:
- **Node.js** (versi 18+)
- **Java JDK** (versi 17)
- **Android Studio** (terbaru)

---

## 2. Membuka Project di Android Studio

1. Buka **Android Studio**.
2. Pilih **Open**.
3. Arahkan ke folder project Anda: `c:\Railan\New folder\ciphermeet\cipher-meet-mobile\android`.
   > **Penting:** Pastikan Anda memilih folder `android` di dalam folder project React Native, bukan folder root projectnya.
4. Tunggu hingga proses **Gradle Sync** selesai (lihat progress bar di bagian bawah kanan). Ini mungkin memakan waktu 5-10 menit saat pertama kali dibuka.

---

## 3. Menjalankan Aplikasi (Run App)

### Opsi A: Menggunakan Emulator
1. Di Android Studio, buka **Device Manager** (ikon ponsel di toolbar kanan atas).
2. Klik tombol **Play** (segitiga hijau) pada salah satu emulator yang tersedia.
3. Setelah emulator menyala, klik tombol **Run 'app'** (segitiga hijau di toolbar atas) di Android Studio.

### Opsi B: Menggunakan Device Fisik (HP)
1. Hubungkan HP Android ke PC menggunakan kabel USB.
2. Pastikan **USB Debugging** sudah aktif di HP.
3. Di toolbar atas Android Studio, nama HP Anda akan muncul di dropdown device selector.
4. Klik tombol **Run 'app'**.

---

## 4. Menjalankan Metro Bundler (Wajib)

Agar aplikasi bisa memuat kode JavaScript/React Native, Anda harus menjalankan Metro Bundler di terminal terpisah.

1. Buka terminal (CMD/PowerShell/Git Bash).
2. Masuk ke folder root project:
   ```bash
   cd c:\Railan\New folder\ciphermeet\cipher-meet-mobile
   ```
3. Jalankan perintah:
   ```bash
   npm start
   ```

> **Tips:** Jika Anda menggunakan HP fisik, jangan lupa jalankan perintah ini di terminal baru agar HP bisa connect ke server lokal PC:
> ```bash
> adb reverse tcp:8081 tcp:8081
> ```

---

## 5. Fitur Baru: In-App Log Viewer 🐛

Kami telah menambahkan fitur **Log Viewer** langsung di dalam aplikasi untuk memudahkan Anda melihat error tanpa harus membuka Android Studio Logcat.

### Cara Menggunakan:
1. Buka aplikasi di HP/Emulator.
2. Perhatikan tombol melayang (Floating Button) bertuliskan **"🐛 Logs"** di pojok kanan bawah layar.
3. Klik tombol tersebut untuk membuka jendela Log.
4. Anda akan melihat semua log:
   - **Putih/Hijau:** Info biasa (console.log)
   - **Kuning:** Warning (console.warn)
   - **Merah:** Error (console.error)

### Fitur Log Viewer:
- **Real-time:** Log akan muncul seketika saat terjadi.
- **Clear:** Tombol untuk menghapus riwayat log.
- **Close:** Menutup jendela log viewer.
- **Auto-Capture:** Menangkap semua error yang biasanya hanya muncul di terminal.

---

## 6. Troubleshooting Umum

### "Unable to load script"
- Pastikan `npm start` (Metro Bundler) sedang berjalan.
- Jika pakai HP, jalankan `adb reverse tcp:8081 tcp:8081`.
- Goyangkan HP (atau tekan `Ctrl+M` di emulator) -> pilih **Reload**.

### "Gradle Build Failed"
- Coba bersihkan cache build dengan perintah:
  ```bash
  cd android
  ./gradlew clean
  ```
- Lalu coba Run lagi dari Android Studio.

### App Crash saat Dibuka
- Cek **Log Viewer** jika sempat terbuka.
- Atau buka tab **Logcat** di bagian bawah Android Studio untuk melihat error native Java/Kotlin.
