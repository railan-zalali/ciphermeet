import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';

interface PushJob {
    fcmToken: string;
    title: string;
    body: string;
    data: Record<string, string>;
    imageUrl?: string;
}

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
    private readonly logger = new Logger(NotificationsProcessor.name);

    constructor(private configService: ConfigService) {
        super();
    }

    async process(job: Job<PushJob>): Promise<void> {
        const { fcmToken, title, body, data, imageUrl } = job.data;
        const serverKey = this.configService.get<string>('fcm.serverKey');

        if (!serverKey) {
            this.logger.warn('FCM server key not configured — skipping push notification');
            return;
        }

        try {
            const message = {
                to: fcmToken,
                notification: {
                    title,
                    body,
                    ...(imageUrl ? { image: imageUrl } : {}),
                },
                data,
                android: {
                    notification: {
                        click_action: 'FLUTTER_NOTIFICATION_CLICK',
                        sound: 'default',
                        priority: 'high',
                        channel_id: 'ciphermeet_messages',
                    },
                },
            };

            const response = await fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `key=${serverKey}`,
                },
                body: JSON.stringify(message),
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`FCM error ${response.status}: ${err}`);
            }

            const result = await response.json() as { success?: number; failure?: number };
            if (result.failure && result.failure > 0) {
                throw new Error(`FCM delivery failed: ${JSON.stringify(result)}`);
            }

            this.logger.log(`Push sent to ${fcmToken.slice(0, 10)}... (job ${job.id})`);
        } catch (error) {
            this.logger.error(`Failed to send push notification: ${(error as Error).message}`);
            throw error; // Re-throw for BullMQ retry
        }
    }
}
