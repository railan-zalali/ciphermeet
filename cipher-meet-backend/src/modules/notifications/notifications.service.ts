import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { User } from '../users/entities/user.entity';

export interface PushNotificationPayload {
    userId: string;
    title: string;
    body: string;
    data?: Record<string, string>;
    imageUrl?: string;
}

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    private readonly serverKey: string;

    constructor(
        private configService: ConfigService,
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectQueue('notifications') private notificationQueue: Queue,
    ) {
        this.serverKey = this.configService.get<string>('fcm.serverKey') ?? '';
    }

    // ─── Send to specific user (via FCM) ────────────────────────────────────────
    async sendToUser(payload: PushNotificationPayload): Promise<void> {
        const user = await this.userRepo.findOne({
            where: { id: payload.userId },
            select: ['id', 'fcmToken'],
        });

        if (!user?.fcmToken) {
            this.logger.warn(`No FCM token for user ${payload.userId}`);
            return;
        }

        await this.notificationQueue.add('send-push', {
            fcmToken: user.fcmToken,
            title: payload.title,
            body: payload.body,
            data: payload.data ?? {},
            imageUrl: payload.imageUrl,
        }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
            removeOnComplete: 100,
            removeOnFail: 50,
        });
    }

    // ─── Match notification ───────────────────────────────────────────────────────
    async sendMatchNotification(userId1: string, userId2: string, matcherName: string): Promise<void> {
        await Promise.allSettled([
            this.sendToUser({
                userId: userId1,
                title: '💫 Match Baru!',
                body: `Kamu dan ${matcherName} saling suka! Mulai ngobrol sekarang.`,
                data: { type: 'match', targetUserId: userId2 },
            }),
            this.sendToUser({
                userId: userId2,
                title: '💫 Match Baru!',
                body: `Kamu berhasil match! Cek siapa yang suka kamu.`,
                data: { type: 'match', targetUserId: userId1 },
            }),
        ]);
    }

    // ─── New message notification ─────────────────────────────────────────────────
    async sendMessageNotification(receiverId: string, senderName: string, conversationId: string): Promise<void> {
        await this.sendToUser({
            userId: receiverId,
            title: `💬 Pesan dari ${senderName}`,
            body: '🔒 Pesan terenkripsi',
            data: { type: 'message', conversationId },
        });
    }

    // ─── Update FCM Token ─────────────────────────────────────────────────────────
    async updateFcmToken(userId: string, token: string): Promise<void> {
        await this.userRepo.update(userId, { fcmToken: token });
    }
}
