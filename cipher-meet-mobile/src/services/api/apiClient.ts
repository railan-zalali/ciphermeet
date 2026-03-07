import axios from 'axios';
import { MMKV } from 'react-native-mmkv';

// ─── Storage ─────────────────────────────────────────────────────────────────
const storage = new MMKV({ id: 'auth-tokens' });

// ─── Axios Instance ────────────────────────────────────────────────────────────
export const apiClient = axios.create({
    baseURL: 'http://10.0.2.2:3000/api/v1', // Android emulator → localhost:3000
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor — attach access token ─────────────────────────────
apiClient.interceptors.request.use((config) => {
    const token = storage.getString('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Response Interceptor — handle 401, refresh token ─────────────────────
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config as typeof error.config & { _retry?: boolean };

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            if (isRefreshing) {
                return new Promise<void>((resolve) => {
                    refreshQueue.push((token: string) => {
                        original.headers.Authorization = `Bearer ${token}`;
                        resolve(apiClient(original));
                    });
                });
            }

            isRefreshing = true;
            try {
                const refreshToken = storage.getString('refreshToken');
                if (!refreshToken) throw new Error('No refresh token');

                const { data } = await axios.post<{ data: { accessToken: string; refreshToken: string } }>(
                    'http://10.0.2.2:3000/api/v1/auth/refresh',
                    { refreshToken },
                );

                const { accessToken, refreshToken: newRefreshToken } = data.data;
                storage.set('accessToken', accessToken);
                storage.set('refreshToken', newRefreshToken);

                refreshQueue.forEach((cb) => cb(accessToken));
                refreshQueue = [];

                original.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(original);
            } catch {
                storage.clearAll();
                // Signal auth store to logout — emit event
                refreshQueue = [];
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

// ─── API Response wrapper ──────────────────────────────────────────────────
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    timestamp: string;
}
