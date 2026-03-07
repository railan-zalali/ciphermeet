import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../services/api/users.api';
import { useAuthStore } from '../stores/authStore';
import type { UpdateProfilePayload } from '../services/api/users.api';

export const USER_KEYS = {
    me: ['users', 'me'] as const,
    profile: (id: string) => ['users', id] as const,
};

// ─── My Profile Hook ─────────────────────────────────────────────────────────
export function useMyProfile() {
    return useQuery({
        queryKey: USER_KEYS.me,
        queryFn: async () => {
            const res = await usersApi.getMyProfile();
            return res.data.data;
        },
        staleTime: 1000 * 60 * 5,
    });
}

// ─── Update Profile Mutation ──────────────────────────────────────────────────
export function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateProfilePayload) => usersApi.updateProfile(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: USER_KEYS.me });
        },
    });
}

// ─── Public Profile Hook ──────────────────────────────────────────────────────
export function usePublicProfile(userId: string) {
    return useQuery({
        queryKey: USER_KEYS.profile(userId),
        queryFn: async () => {
            const res = await usersApi.getPublicProfile(userId);
            return res.data.data;
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2,
    });
}
