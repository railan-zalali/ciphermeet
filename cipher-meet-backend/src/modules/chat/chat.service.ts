import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument, Conversation, ConversationDocument } from './schemas/message.schema';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
    ) { }

    async getConversations(userId: string) {
        return this.conversationModel
            .find({ participants: userId })
            .sort({ lastMessageAt: -1 })
            .limit(50)
            .lean();
    }

    async getMessages(userId: string, conversationId: string, page = 1, limit = 50) {
        const conversation = await this.conversationModel.findOne({
            _id: conversationId,
            participants: userId,
        });
        if (!conversation) return [];

        // Mark messages as delivered when fetched
        await this.messageModel.updateMany(
            { conversationId, receiverId: userId, isDelivered: false },
            { isDelivered: true },
        );

        return this.messageModel
            .find({ conversationId, isDeleted: false })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
    }

    async deleteMessage(userId: string, messageId: string) {
        return this.messageModel.updateOne(
            { _id: messageId, senderId: userId },
            { isDeleted: true },
        );
    }
}
