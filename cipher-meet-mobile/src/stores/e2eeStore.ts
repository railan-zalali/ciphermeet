import { create } from 'zustand';
import QuickCrypto from 'react-native-quick-crypto';
import { Buffer } from 'buffer';

// ─── Types ─────────────────────────────────────────────────────────────────────
// Simplified E2EE session representation (without @signalapp/libsignal-client for now)
// When the library is available, replace with real X3DH + Double Ratchet state

export interface PreKeyBundle {
    identityKey: string;     // base64
    signedPreKey: string;    // base64
    signedPreKeyId: number;
    signature: string;       // base64
    oneTimePreKey?: string;  // base64
    oneTimePreKeyId?: number;
}

export interface E2EESession {
    userId: string;
    sessionEstablished: boolean;
    lastKeyRotation: number; // timestamp
}

interface E2EEState {
    myIdentityKey: string | null;
    sessions: Record<string, E2EESession>; // keyed by userId
    setIdentityKey: (key: string) => void;
    storeSession: (userId: string, session: E2EESession) => void;
    hasSession: (userId: string) => boolean;
    getSession: (userId: string) => E2EESession | undefined;
    // Stub: in production, replace with real Signal Protocol encrypt/decrypt
    encryptMessage: (plaintext: string, receiverId: string) => string;
    decryptMessage: (ciphertext: string, senderId: string) => string;
}

export const useE2EEStore = create<E2EEState>((set, get) => ({
    myIdentityKey: null,
    sessions: {},

    setIdentityKey: (key) => set({ myIdentityKey: key }),

    storeSession: (userId, session) =>
        set((state) => ({ sessions: { ...state.sessions, [userId]: session } })),

    hasSession: (userId) => !!get().sessions[userId]?.sessionEstablished,

    getSession: (userId) => get().sessions[userId],

    // ─── STUB: Replace with real libsignal-client implementation ──────────────────
    // In production: X3DH key agreement + Double Ratchet encryption
    // CURRENT: AES-256-GCM (Better than hex encoding, but still symmetric only)
    encryptMessage: (plaintext: string, _receiverId: string): string => {
        try {
            // Generate a random 32-byte key (In real E2EE, this comes from X3DH)
            // For now, we use a fixed derived key from the stub environment or a hardcoded one for demo
            // WARNING: This is still a STUB. Do not use for real confidential data.
            const key = QuickCrypto.createHash('sha256').update('stub-shared-secret').digest(); 
            const iv = QuickCrypto.randomBytes(12);
            
            const cipher = QuickCrypto.createCipheriv('aes-256-gcm', key, iv);
            let encrypted = cipher.update(plaintext, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            const authTag = cipher.getAuthTag().toString('hex');

            // Format: IV:AuthTag:Ciphertext
            return `${iv.toString('hex')}:${authTag}:${encrypted}`;
        } catch (e) {
            console.error('Encryption failed:', e);
            return `ERROR::${plaintext}`;
        }
    },

    decryptMessage: (ciphertext: string, _senderId: string): string => {
        try {
            if (!ciphertext.includes(':')) return '[Format Pesan Tidak Valid]';

            const parts = ciphertext.split(':');
            if (parts.length !== 3) return '[Format Pesan Rusak]';

            const [ivHex, authTagHex, encryptedHex] = parts;
            
            const key = QuickCrypto.createHash('sha256').update('stub-shared-secret').digest();
            const iv = Buffer.from(ivHex, 'hex');
            const authTag = Buffer.from(authTagHex, 'hex');

            const decipher = QuickCrypto.createDecipheriv('aes-256-gcm', key, iv);
            decipher.setAuthTag(authTag);
            
            let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            return decrypted;
        } catch (e) {
            console.error('Decryption failed:', e);
            return '[Gagal Mendekripsi Pesan]';
        }
    },
}));
