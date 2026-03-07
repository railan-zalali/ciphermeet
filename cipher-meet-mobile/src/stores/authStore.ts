import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'auth-store', encryptionKey: 'cipher-meet-auth-key' });

interface User {
    id: string;
    email: string;
    fullName: string;
    photos?: string[];
    isVerified?: boolean;
    subscriptionTier?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    setTokens: (access: string, refresh: string) => void;
    setUser: (user: User) => void;
    logout: () => void;
}

// Persist tokens in encrypted MMKV
const persistedAccessToken = storage.getString('accessToken') ?? null;
const persistedRefreshToken = storage.getString('refreshToken') ?? null;
const persistedUser = storage.getString('user');

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: !!persistedAccessToken,
    accessToken: persistedAccessToken,
    refreshToken: persistedRefreshToken,
    user: persistedUser ? (JSON.parse(persistedUser) as User) : null,

    setTokens: (access, refresh) => {
        storage.set('accessToken', access);
        storage.set('refreshToken', refresh);
        set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
    },

    setUser: (user) => {
        storage.set('user', JSON.stringify(user));
        set({ user });
    },

    logout: () => {
        storage.delete('accessToken');
        storage.delete('refreshToken');
        storage.delete('user');
        set({ isAuthenticated: false, accessToken: null, refreshToken: null, user: null });
    },
}));
