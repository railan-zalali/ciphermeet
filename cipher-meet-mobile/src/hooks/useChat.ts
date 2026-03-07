import { useQuery } from '@tanstack/react-query';
import { chatApi } from '../services/api/chat.api';

export const CHAT_KEYS = {
    conversations: ['chat', 'conversations'] as const,
    messages: (conversationId: string) => ['chat', 'messages', conversationId] as const,
};

// ─── Conversations Hook ────────────────────────────────────────────────────────
export function useConversations() {
    return useQuery({
        queryKey: CHAT_KEYS.conversations,
        queryFn: async () => {
            const res = await chatApi.getConversations();
            return res.data.data;
        },
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 30, // Poll every 30s as fallback to Socket.io
    });
}

// ─── Messages Hook ────────────────────────────────────────────────────────────
export function useMessages(conversationId: string) {
    return useQuery({
        queryKey: CHAT_KEYS.messages(conversationId),
        queryFn: async () => {
            const res = await chatApi.getMessages(conversationId);
            return res.data.data;
        },
        enabled: !!conversationId,
        staleTime: 0, // Always refetch, real-time managed by Socket.io
    });
}
