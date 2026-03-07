import { apiClient, ApiResponse } from './apiClient';
import type { User } from '../../types/user';

export interface UpdateProfilePayload {
    fullName?: string; bio?: string; mbti?: string;
    interests?: string[]; city?: string;
    preferredAgeMin?: number; preferredAgeMax?: number;
    preferredMaxDistanceKm?: number; preferredGenders?: string[];
}

export const usersApi = {
    getMyProfile: () =>
        apiClient.get<ApiResponse<User>>('/users/me'),

    updateProfile: (payload: UpdateProfilePayload) =>
        apiClient.patch<ApiResponse<User>>('/users/me', payload),

    updateLocation: (latitude: number, longitude: number) =>
        apiClient.patch<ApiResponse<void>>('/users/me/location', { latitude, longitude }),

    updateFcmToken: (token: string) =>
        apiClient.patch<ApiResponse<void>>('/notifications/fcm-token', { token }),

    getPublicProfile: (userId: string) =>
        apiClient.get<ApiResponse<User>>(`/users/${userId}`),

    deleteAccount: () =>
        apiClient.delete<ApiResponse<{ message: string }>>('/users/me'),
};
