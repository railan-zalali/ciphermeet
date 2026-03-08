import { database } from '../db';
import { Message } from '../db/models/Message';
import { Conversation } from '../db/models/Conversation';
import { Q } from '@nozbe/watermelondb';

export const ChatService = {
    // ─── Conversations ───────────────────────────────────────────────────────────
    async getConversation(remoteId: string) {
        const collection = database.get<Conversation>('conversations');
        const conversations = await collection.query(Q.where('remote_id', remoteId)).fetch();
        return conversations[0] || null;
    },

    async createOrUpdateConversation(data: {
        remoteId: string;
        participants: string[];
        lastMessageAt: number;
        lastMessagePreview: string;
        unreadCount: number;
    }) {
        const collection = database.get<Conversation>('conversations');
        
        await database.write(async () => {
            const existing = await this.getConversation(data.remoteId);
            
            if (existing) {
                await existing.update(c => {
                    c.lastMessageAt = new Date(data.lastMessageAt);
                    c.lastMessagePreview = data.lastMessagePreview;
                    c.unreadCount = data.unreadCount;
                });
            } else {
                await collection.create(c => {
                    c.remoteId = data.remoteId;
                    c.participantsJson = JSON.stringify(data.participants);
                    c.lastMessageAt = new Date(data.lastMessageAt);
                    c.lastMessagePreview = data.lastMessagePreview;
                    c.unreadCount = data.unreadCount;
                });
            }
        });
    },

    // ─── Messages ────────────────────────────────────────────────────────────────
    observeMessages(conversationRemoteId: string) {
        return database
            .get<Message>('messages')
            .query(
                Q.on('conversations', 'remote_id', conversationRemoteId),
                Q.sortBy('created_at', Q.desc)
            )
            .observe();
    },

    async saveMessage(data: {
        remoteId: string;
        conversationRemoteId: string;
        senderId: string;
        content: string;
        messageType: 'text' | 'image' | 'voice';
        status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
        createdAt: number;
    }) {
        const conversation = await this.getConversation(data.conversationRemoteId);
        if (!conversation) {
            console.error('Conversation not found for message:', data);
            return;
        }

        await database.write(async () => {
            await database.get<Message>('messages').create(m => {
                m.remoteId = data.remoteId;
                m.conversation.set(conversation);
                m.senderId = data.senderId;
                m.content = data.content;
                m.messageType = data.messageType;
                m.status = data.status;
                // m.createdAt is readonly and set by WatermelonDB, but we can override _status if needed
                // or just rely on local timestamp. For syncing, we might need a separate 'timestamp' column.
                // For now, let's assume createdAt matches
            });
        });
    }
};
