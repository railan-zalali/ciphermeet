import { create } from 'zustand';
import { storage, StorageKeys } from '../utils/storage';

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

// Initialize store with async loading
export const useAuthStore = create<AuthState>((set) => {
    // Initial load
    const loadStorage = async () => {
        try {
            const accessToken = await storage.getString(StorageKeys.ACCESS_TOKEN);
            const refreshToken = await storage.getString(StorageKeys.REFRESH_TOKEN);
            const userStr = await storage.getString(StorageKeys.USER);
            
            if (accessToken) {
                set({ 
                    isAuthenticated: true,
                    accessToken,
                    refreshToken,
                    user: userStr ? JSON.parse(userStr) : null 
                });
            }
        } catch (error) {
            console.error('Failed to load auth state:', error);
        }
    };
    
    loadStorage();

    return {
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        user: null,

        setTokens: (access, refresh) => {
            storage.set(StorageKeys.ACCESS_TOKEN, access);
            storage.set(StorageKeys.REFRESH_TOKEN, refresh);
            set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
        },

        setUser: (user) => {
            storage.set(StorageKeys.USER, JSON.stringify(user));
            set({ user });
        },

        logout: () => {
            storage.delete(StorageKeys.ACCESS_TOKEN);
            storage.delete(StorageKeys.REFRESH_TOKEN);
            storage.delete(StorageKeys.USER);
            set({ isAuthenticated: false, accessToken: null, refreshToken: null, user: null });
        },
    };
});
