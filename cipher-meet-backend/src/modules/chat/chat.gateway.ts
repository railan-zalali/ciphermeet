import {
    WebSocketGateway, WebSocketServer, SubscribeMessage,
    MessageBody, ConnectedSocket, OnGatewayConnection,
    OnGatewayDisconnect, WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Message, MessageDocument, Conversation, ConversationDocument } from './schemas/message.schema';

interface SendMessagePayload {
    conversationId: string;
    receiverId: string;
    ciphertext: string;
    ephemeralKeyId?: number;
    messageType?: string;
    replyTo?: string;
    expiresAt?: string;
}

@WebSocketGateway({
    cors: { origin: '*', credentials: true },
    namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private readonly logger = new Logger(ChatGateway.name);
    private userSockets = new Map<string, string[]>(); // userId → socketIds

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
    ) { }

    // ─── Connection ──────────────────────────────────────────────────────────────
    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth?.token as string;
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>('jwt.secret'),
            });
            client.data.userId = payload.sub;

            const sockets = this.userSockets.get(payload.sub) ?? [];
            sockets.push(client.id);
            this.userSockets.set(payload.sub, sockets);

            // Join personal room
            void client.join(`user:${payload.sub}`);
            this.logger.log(`User ${payload.sub} connected: ${client.id}`);
        } catch {
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        const userId = client.data.userId as string;
        if (userId) {
            const sockets = (this.userSockets.get(userId) ?? []).filter((id) => id !== client.id);
            if (sockets.length === 0) {
                this.userSockets.delete(userId);
            } else {
                this.userSockets.set(userId, sockets);
            }
            this.logger.log(`User ${userId} disconnected: ${client.id}`);
        }
    }

    // ─── Message Send ────────────────────────────────────────────────────────────
    @SubscribeMessage('message:send')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: SendMessagePayload,
    ) {
        const senderId = client.data.userId as string;
        if (!senderId) throw new WsException('Unauthorized');

        // Ensure conversation exists
        let conversation = await this.conversationModel.findOne({
            _id: payload.conversationId,
            participants: senderId,
        });

        if (!conversation) {
            conversation = await this.conversationModel.create({
                participants: [senderId, payload.receiverId],
                lastMessageAt: new Date(),
                unreadCount: { [payload.receiverId]: 1 },
            });
        }

        // Persist encrypted message
        const message = await this.messageModel.create({
            conversationId: conversation._id.toString(),
            senderId,
            receiverId: payload.receiverId,
            ciphertext: payload.ciphertext,
            ephemeralKeyId: payload.ephemeralKeyId,
            messageType: payload.messageType ?? 'text',
            replyTo: payload.replyTo ?? null,
            expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
        });

        // Update conversation metadata
        await this.conversationModel.updateOne(
            { _id: conversation._id },
            {
                lastMessageAt: new Date(),
                lastMessagePreview: '[🔒 Terenkripsi]',
                $inc: { [`unreadCount.${payload.receiverId}`]: 1 },
            },
        );

        // Emit to receiver
        this.server.to(`user:${payload.receiverId}`).emit('message:received', {
            messageId: (message._id as { toString(): string }).toString(),
            conversationId: conversation._id.toString(),
            senderId,
            ciphertext: payload.ciphertext,
            ephemeralKeyId: payload.ephemeralKeyId,
            messageType: payload.messageType ?? 'text',
            replyTo: payload.replyTo,
            expiresAt: payload.expiresAt,
            createdAt: message.createdAt,
        });

        // Confirm to sender
        client.emit('message:sent', {
            messageId: (message._id as { toString(): string }).toString(),
            conversationId: conversation._id.toString(),
        });

        return { status: 'ok' };
    }

    // ─── Typing Indicators ───────────────────────────────────────────────────────
    @SubscribeMessage('typing:start')
    handleTypingStart(@ConnectedSocket() client: Socket, @MessageBody() { receiverId }: { receiverId: string }) {
        this.server.to(`user:${receiverId}`).emit('typing:start', { userId: client.data.userId as string });
    }

    @SubscribeMessage('typing:stop')
    handleTypingStop(@ConnectedSocket() client: Socket, @MessageBody() { receiverId }: { receiverId: string }) {
        this.server.to(`user:${receiverId}`).emit('typing:stop', { userId: client.data.userId as string });
    }

    // ─── Read Receipt ────────────────────────────────────────────────────────────
    @SubscribeMessage('message:read')
    async handleRead(@ConnectedSocket() client: Socket, @MessageBody() { messageId, senderId }: { messageId: string; senderId: string }) {
        await this.messageModel.updateOne(
            { _id: messageId },
            { isRead: true, readAt: new Date() },
        );
        this.server.to(`user:${senderId}`).emit('message:read', { messageId, readAt: new Date() });
    }

    // ─── Reaction ────────────────────────────────────────────────────────────────
    @SubscribeMessage('message:react')
    async handleReact(
        @ConnectedSocket() client: Socket,
        @MessageBody() { messageId, emoji, receiverId }: { messageId: string; emoji: string; receiverId: string },
    ) {
        const userId = client.data.userId as string;
        await this.messageModel.updateOne(
            { _id: messageId },
            { $set: { [`reactions.${userId}`]: emoji } },
        );
        this.server.to(`user:${receiverId}`).emit('message:reaction', { messageId, userId, emoji });
    }
}
