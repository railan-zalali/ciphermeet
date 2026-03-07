import { apiClient, ApiResponse } from './apiClient';

export interface DiscoveryProfile {
    id: string; name: string; age: number; city: string;
    distanceKm: number; photos: string[]; bio: string;
    interests: string[]; isVerified: boolean; mbti?: string;
}

export interface Match {
    id: string; matchedAt: string;
    partner: { id: string; name: string; photos: string[] };
}

export const discoveryApi = {
    getFeed: (params?: { lat?: number; lng?: number }) =>
        apiClient.get<ApiResponse<DiscoveryProfile[]>>('/discovery/feed', { params }),

    swipe: (targetId: string, action: 'like' | 'pass' | 'super_like') =>
        apiClient.post<ApiResponse<{ matched: boolean; matchId?: string }>>('/discovery/swipe', { targetId, action }),

    getMatches: () =>
        apiClient.get<ApiResponse<Match[]>>('/discovery/matches'),
};
