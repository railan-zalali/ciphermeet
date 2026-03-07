import { apiClient, ApiResponse } from './apiClient';

export interface ConversationSummary {
    id: string; partnerName: string; partnerAvatar?: string;
    lastMessageAt: string; unreadCount: number; isOnline?: boolean;
}

export interface MessageItem {
    id: string; conversationId: string; senderId: string; receiverId: string;
    ciphertext: string; createdAt: string; isRead: boolean;
    messageType: 'text' | 'image' | 'voice'; reactions?: Record<string, string>;
}

export const chatApi = {
    getConversations: () =>
        apiClient.get<ApiResponse<ConversationSummary[]>>('/chat/conversations'),

    getMessages: (conversationId: string, page = 1) =>
        apiClient.get<ApiResponse<MessageItem[]>>(`/chat/conversations/${conversationId}/messages`, {
            params: { page, limit: 30 },
        }),

    deleteMessage: (messageId: string) =>
        apiClient.delete<ApiResponse<void>>(`/chat/messages/${messageId}`),
};
