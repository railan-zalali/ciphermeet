import { apiClient, ApiResponse } from './apiClient';
import type { Gender } from '../../types/user';

// ─── DTOs ─────────────────────────────────────────────────────────────────────
export interface RegisterPayload {
    fullName: string; email: string; phoneNumber: string;
    password: string; dateOfBirth: string; gender: Gender;
}

export interface LoginPayload { emailOrPhone: string; password: string; deviceId?: string; }

export interface AuthTokens {
    accessToken: string; refreshToken: string;
    user: { id: string; email: string; fullName: string };
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
    register: (payload: RegisterPayload) =>
        apiClient.post<ApiResponse<{ message: string }>>('/auth/register', payload),

    verifyOtp: (phoneNumber: string, otp: string) =>
        apiClient.post<ApiResponse<AuthTokens>>('/auth/verify-otp', { phoneNumber, otp }),

    login: (payload: LoginPayload) =>
        apiClient.post<ApiResponse<AuthTokens>>('/auth/login', payload),

    me: () =>
        apiClient.get<ApiResponse<AuthTokens['user']>>('/auth/me'),

    refresh: (refreshToken: string) =>
        apiClient.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken }),

    logout: () =>
        apiClient.post<ApiResponse<{ message: string }>>('/auth/logout'),
};
