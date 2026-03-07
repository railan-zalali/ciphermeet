import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { discoveryApi } from '../services/api/discovery.api';
import { useDiscoveryStore } from '../stores/discoveryStore';

export const DISCOVERY_KEYS = {
    feed: ['discovery', 'feed'] as const,
    matches: ['discovery', 'matches'] as const,
};

// ─── Feed Hook ─────────────────────────────────────────────────────────────────
export function useDiscoveryFeed(lat?: number, lng?: number) {
    const { setProfiles } = useDiscoveryStore();

    return useQuery({
        queryKey: DISCOVERY_KEYS.feed,
        queryFn: async () => {
            const res = await discoveryApi.getFeed({ lat, lng });
            const profiles = res.data.data;
            setProfiles(profiles);
            return profiles;
        },
        staleTime: 1000 * 60 * 2,
        refetchOnWindowFocus: false,
    });
}

// ─── Swipe Mutation ───────────────────────────────────────────────────────────
export function useSwipe() {
    const { removeTopProfile } = useDiscoveryStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ targetId, action }: { targetId: string; action: 'like' | 'pass' | 'super_like' }) =>
            discoveryApi.swipe(targetId, action),
        onMutate: () => {
            removeTopProfile(); // Optimistic: remove card immediately
        },
        onSuccess: (res) => {
            if (res.data.data.matched) {
                queryClient.invalidateQueries({ queryKey: DISCOVERY_KEYS.matches }).catch(() => {});
            }
        },
        onError: (_, __, _context) => {
            // If error, restore card — for simplicity, refetch feed
            queryClient.invalidateQueries({ queryKey: DISCOVERY_KEYS.feed }).catch(() => {});
        },
    });
}

// ─── Matches Hook ─────────────────────────────────────────────────────────────
export function useMatches() {
    return useQuery({
        queryKey: DISCOVERY_KEYS.matches,
        queryFn: async () => {
            const res = await discoveryApi.getMatches();
            return res.data.data;
        },
        staleTime: 1000 * 60 * 1,
    });
}
