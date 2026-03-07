import {
    Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    PreKeyBundle, OneTimePreKey,
} from './entities/keys.entities';
import { User } from '../users/entities/user.entity';

@Injectable()
export class KeysService {
    constructor(
        @InjectRepository(PreKeyBundle) private bundleRepo: Repository<PreKeyBundle>,
        @InjectRepository(OneTimePreKey) private otpkRepo: Repository<OneTimePreKey>,
        @InjectRepository(User) private userRepo: Repository<User>,
    ) { }

    async uploadBundle(userId: string, dto: {
        identityPublicKey: string;
        signedPreKey: string;
        signedPreKeySignature: string;
        signedPreKeyId: number;
        oneTimePreKeys: { keyId: number; publicKey: string }[];
    }) {
        // Upsert the main bundle
        await this.bundleRepo.upsert(
            {
                userId,
                identityPublicKey: dto.identityPublicKey,
                signedPreKey: dto.signedPreKey,
                signedPreKeySignature: dto.signedPreKeySignature,
                signedPreKeyId: dto.signedPreKeyId,
            },
            { conflictPaths: ['userId'] },
        );

        // Save identity key on user record too (for display)
        await this.userRepo.update(userId, { identityPublicKey: dto.identityPublicKey });

        // Bulk-insert one-time pre-keys
        const otpks = dto.oneTimePreKeys.map((k) => ({
            userId,
            keyId: k.keyId,
            publicKey: k.publicKey,
        }));
        await this.otpkRepo.upsert(otpks, { conflictPaths: ['userId', 'keyId'] });

        return { message: 'Pre-key bundle berhasil diupload' };
    }

    async getBundle(targetUserId: string) {
        const bundle = await this.bundleRepo.findOne({ where: { userId: targetUserId } });
        if (!bundle) throw new NotFoundException('Pre-key bundle tidak ditemukan');

        // Consume one OTP key
        const otpk = await this.otpkRepo.findOne({
            where: { userId: targetUserId, isConsumed: false },
            order: { createdAt: 'ASC' },
        });

        if (otpk) {
            await this.otpkRepo.update(otpk.id, { isConsumed: true, consumedAt: new Date() });
        }

        return {
            identityPublicKey: bundle.identityPublicKey,
            signedPreKey: bundle.signedPreKey,
            signedPreKeySignature: bundle.signedPreKeySignature,
            signedPreKeyId: bundle.signedPreKeyId,
            oneTimePreKey: otpk ? { keyId: otpk.keyId, publicKey: otpk.publicKey } : null,
        };
    }

    async rotateSignedPreKey(userId: string, dto: {
        signedPreKey: string;
        signedPreKeySignature: string;
        signedPreKeyId: number;
    }) {
        await this.bundleRepo.update(
            { userId },
            {
                signedPreKey: dto.signedPreKey,
                signedPreKeySignature: dto.signedPreKeySignature,
                signedPreKeyId: dto.signedPreKeyId,
                updatedAt: new Date(),
            },
        );
        return { message: 'Signed pre-key berhasil dirotasi' };
    }
}
