import { create } from 'zustand';

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

    // ── STUB: Replace with real libsignal-client implementation ──────────────────
    // In production: X3DH key agreement + Double Ratchet encryption
    encryptMessage: (plaintext: string, _receiverId: string): string => {
        // TODO: implement real Signal Protocol encryption using @signalapp/libsignal-client
        // Simple reversible encoding for stub (NOT real encryption)
        const encoded = plaintext.split('').map((c) =>
            c.charCodeAt(0).toString(16).padStart(2, '0')
        ).join('');
        return `ENCRYPTED::${encoded}`;
    },

    decryptMessage: (ciphertext: string, _senderId: string): string => {
        // TODO: implement real Signal Protocol decryption
        if (ciphertext.startsWith('ENCRYPTED::')) {
            try {
                const hex = ciphertext.replace('ENCRYPTED::', '');
                const decoded = hex.match(/.{1,2}/g)?.map((byte) =>
                    String.fromCharCode(parseInt(byte, 16))
                ).join('') ?? '';
                return decoded;
            } catch {
                return '[Tidak dapat mendekripsi pesan]';
            }
        }
        return '[Tidak dapat mendekripsi pesan]';
    },
}));
