import {
    Injectable, BadRequestException, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from '../keys/entities/keys.entities';

@Injectable()
export class SecurityService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(RefreshToken) private sessionRepo: Repository<RefreshToken>,
        @InjectRedis() private redis: Redis,
    ) { }

    // ─── 2FA TOTP ────────────────────────────────────────────────────────────────
    async setup2FA(userId: string) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('Pengguna tidak ditemukan');

        const secret = speakeasy.generateSecret({
            name: `CipherMeet:${user.email}`,
            issuer: 'CipherMeet',
        });

        // Store temporarily in Redis until confirmed
        await this.redis.setex(`2fa_setup:${userId}`, 300, secret.base32);

        const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url ?? '');
        return {
            secret: secret.base32,
            qrCode: qrDataUrl,
            message: 'Scan QR code dengan Google Authenticator, lalu verifikasi dengan kode 6 digit',
        };
    }

    async verify2FA(userId: string, code: string) {
        const pendingSecret = await this.redis.get(`2fa_setup:${userId}`);
        const user = await this.userRepo.findOne({
            where: { id: userId },
            select: ['id', 'totpSecret', 'isTotpEnabled'],
        });
        if (!user) throw new NotFoundException('Pengguna tidak ditemukan');

        const secretToVerify = pendingSecret ?? user.totpSecret;
        if (!secretToVerify) throw new BadRequestException('Setup 2FA belum dimulai');

        const isValid = speakeasy.totp.verify({
            secret: secretToVerify,
            encoding: 'base32',
            token: code,
            window: 1,
        });

        if (!isValid) throw new BadRequestException('Kode verifikasi tidak valid');

        if (pendingSecret) {
            await this.userRepo.update(userId, { totpSecret: pendingSecret, isTotpEnabled: true });
            await this.redis.del(`2fa_setup:${userId}`);
        }

        return { message: '2FA berhasil diaktifkan' };
    }

    async disable2FA(userId: string) {
        await this.userRepo.update(userId, { totpSecret: undefined, isTotpEnabled: false });
        return { message: '2FA berhasil dinonaktifkan' };
    }

    // ─── Sessions ────────────────────────────────────────────────────────────────
    async getActiveSessions(userId: string) {
        return this.sessionRepo.find({
            where: { userId, isRevoked: false },
            select: ['id', 'deviceId', 'deviceName', 'ipAddress', 'createdAt', 'expiresAt'],
            order: { createdAt: 'DESC' },
        });
    }

    async revokeSession(userId: string, sessionId: string) {
        const session = await this.sessionRepo.findOne({ where: { id: sessionId, userId } });
        if (!session) throw new NotFoundException('Sesi tidak ditemukan');
        await this.sessionRepo.update(sessionId, { isRevoked: true });
        return { message: 'Sesi berhasil dicabut' };
    }

    async revokeAllSessions(userId: string) {
        await this.sessionRepo.update({ userId, isRevoked: false }, { isRevoked: true });
        return { message: 'Semua sesi berhasil dicabut' };
    }

    // ─── Activity Log ────────────────────────────────────────────────────────────
    async logActivity(userId: string, action: string, meta?: object) {
        const key = `activity_log:${userId}`;
        const entry = JSON.stringify({ action, meta, timestamp: new Date().toISOString() });
        await this.redis.lpush(key, entry);
        await this.redis.ltrim(key, 0, 99); // Keep last 100
    }

    async getActivityLog(userId: string) {
        const entries = await this.redis.lrange(`activity_log:${userId}`, 0, 49);
        return entries.map((e) => JSON.parse(e) as object);
    }
}
