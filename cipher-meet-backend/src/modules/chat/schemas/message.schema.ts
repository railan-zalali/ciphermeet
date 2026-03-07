import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    VOICE = 'voice',
    REACTION = 'reaction',
}

@Schema({ timestamps: true, collection: 'messages' })
export class Message {
    @Prop({ required: true, index: true })
    conversationId: string;

    @Prop({ required: true })
    senderId: string;

    @Prop()
    receiverId: string;

    // E2EE ciphertext (Signal Protocol Double Ratchet output)
    @Prop({ required: true })
    ciphertext: string;

    // Ephemeral key and metadata for key ratchet step
    @Prop()
    ephemeralKeyId: number;

    @Prop({ type: String, enum: MessageType, default: MessageType.TEXT })
    messageType: MessageType;

    // Reply reference
    @Prop({ type: Types.ObjectId, ref: 'Message', default: null })
    replyTo: Types.ObjectId | null;

    // Message status
    @Prop({ default: false })
    isDelivered: boolean;

    @Prop({ default: false })
    isRead: boolean;

    @Prop({ default: null })
    readAt: Date | null;

    // Disappearing message
    @Prop({ default: null })
    expiresAt: Date | null;

    @Prop({ default: false })
    isDeleted: boolean;

    // Emoji reactions: { userId: emoji }
    @Prop({ type: Object, default: {} })
    reactions: Record<string, string>;

    // Media reference (S3 key)
    @Prop({ default: null })
    mediaUrl: string | null;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// ─── Conversation ────────────────────────────────────────────────────────────

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true, collection: 'conversations' })
export class Conversation {
    @Prop({ type: [String], required: true })
    participants: string[];

    @Prop({ default: null })
    lastMessageAt: Date | null;

    @Prop({ default: null })
    lastMessagePreview: string | null;

    @Prop({ default: false })
    isBlocked: boolean;

    @Prop({ default: null })
    blockedBy: string | null;

    @Prop({ type: Object, default: {} })
    unreadCount: Record<string, number>;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
ConversationSchema.index({ participants: 1 });
