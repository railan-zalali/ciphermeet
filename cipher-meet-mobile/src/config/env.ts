// ─── CipherMeet Environment Config ────────────────────────────────────────────
//
// Opsi A: Android Emulator → gunakan 10.0.2.2 (emulator loopback ke localhost)
// Opsi B: Device Fisik     → ganti dengan IP komputer kamu (cek: ipconfig)
//
// Cara ganti: ubah API_BASE_URL di bawah.
//
// ──────────────────────────────────────────────────────────────────────────────

// ⚠️ DEFAULT: Android Emulator (10.0.2.2)
// Jika menggunakan DEVICE FISIK, ganti dengan IP komputer kamu, contoh: 'http://192.168.1.10:3000'
export const API_BASE_URL = 'http://192.168.1.13:3000';

export const API_V1 = `${API_BASE_URL}/api/v1`;
export const WS_CHAT_URL = `${API_BASE_URL}/chat`;
