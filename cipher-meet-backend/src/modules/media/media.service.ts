import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class MediaService {
    private readonly logger = new Logger(MediaService.name);
    private s3: S3Client;
    private readonly bucket: string;
    private readonly cdnBase: string;

    constructor(private configService: ConfigService) {
        const endpoint = this.configService.get<string>('storage.endpoint');
        const region = this.configService.get<string>('storage.region') ?? 'auto';

        this.s3 = new S3Client({
            region,
            endpoint,
            credentials: {
                accessKeyId: this.configService.get<string>('storage.accessKeyId') ?? '',
                secretAccessKey: this.configService.get<string>('storage.secretAccessKey') ?? '',
            },
        });

        this.bucket = this.configService.get<string>('storage.bucket') ?? 'ciphermeet';
        this.cdnBase = this.configService.get<string>('storage.cdnBase') ?? '';
    }

    // ─── Upload Profile Photo ─────────────────────────────────────────────────────
    async uploadProfilePhoto(userId: string, file: Express.Multer.File): Promise<{ url: string; key: string }> {
        const ext = this.getExtension(file.mimetype);
        const hash = createHash('sha256').update(file.buffer).digest('hex').slice(0, 8);
        const key = `photos/${userId}/${uuidv4()}-${hash}.${ext}`;

        await this.s3.send(new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            CacheControl: 'public, max-age=31536000, immutable',
            Metadata: { userId, uploadedAt: new Date().toISOString() },
        }));

        const url = this.cdnBase ? `${this.cdnBase}/${key}` : `https://${this.bucket}.r2.dev/${key}`;
        this.logger.log(`Photo uploaded: ${key}`);
        return { url, key };
    }

    // ─── Upload Voice Note ────────────────────────────────────────────────────────
    async uploadVoiceNote(userId: string, file: Express.Multer.File): Promise<{ url: string; key: string; durationMs?: number }> {
        const ext = this.getExtension(file.mimetype);
        const key = `voice/${userId}/${uuidv4()}.${ext}`;

        await this.s3.send(new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            CacheControl: 'private, max-age=3600',
            Metadata: { userId },
        }));

        const url = this.cdnBase ? `${this.cdnBase}/${key}` : `https://${this.bucket}.r2.dev/${key}`;
        return { url, key };
    }

    // ─── Delete Object ────────────────────────────────────────────────────────────
    async deleteObject(key: string): Promise<void> {
        await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
        this.logger.log(`Deleted object: ${key}`);
    }

    private getExtension(mimetype: string): string {
        const map: Record<string, string> = {
            'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
            'audio/mpeg': 'mp3', 'audio/ogg': 'ogg', 'audio/webm': 'webm', 'audio/mp4': 'm4a',
        };
        return map[mimetype] ?? 'bin';
    }
}
