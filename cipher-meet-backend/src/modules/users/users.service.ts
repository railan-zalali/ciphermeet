import {
    Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IsString, IsNumber, IsArray, IsEnum, IsOptional, MaxLength, Min, Max } from 'class-validator';
import { Gender, MbtiType } from './entities/user.entity';

export class UpdateProfileDto {
    @IsOptional() @IsString() @MaxLength(300) bio?: string;
    @IsOptional() @IsEnum(MbtiType) mbti?: MbtiType;
    @IsOptional() @IsArray() interests?: string[];
    @IsOptional() @IsString() city?: string;
    @IsOptional() @IsNumber() @Min(0) @Max(90) latitude?: number;
    @IsOptional() @IsNumber() @Min(-180) @Max(180) longitude?: number;
    @IsOptional() @IsNumber() preferredAgeMin?: number;
    @IsOptional() @IsNumber() preferredAgeMax?: number;
    @IsOptional() @IsNumber() preferredMaxDistanceKm?: number;
    @IsOptional() @IsArray() preferredGenders?: string[];
    @IsOptional() @IsArray() photos?: string[];
    @IsOptional() profileSetupStep?: number;
}

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
    ) { }

    async getProfile(userId: string) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('Pengguna tidak ditemukan');
        return user;
    }

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        await this.userRepo.update(userId, dto);
        return this.getProfile(userId);
    }

    async getPublicProfile(targetId: string) {
        const user = await this.userRepo.findOne({
            where: { id: targetId, isActive: true },
            select: [
                'id', 'fullName', 'dateOfBirth', 'photos', 'bio',
                'interests', 'city', 'isVerified', 'mbti', 'gender',
                'identityPublicKey',
            ],
        });
        if (!user) throw new NotFoundException('Profil tidak ditemukan');
        return user;
    }

    async updateLocation(userId: string, latitude: number, longitude: number) {
        await this.userRepo.update(userId, { latitude, longitude, lastActiveAt: new Date() });
        return { message: 'Lokasi berhasil diperbarui' };
    }

    async getStats(userId: string) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException();

        const em = this.userRepo.manager;
        const [totalMatches, likesReceived] = await Promise.all([
            em.createQueryBuilder()
                .select('COUNT(*)', 'count')
                .from('matches', 'm')
                .where('m."user1Id" = :uid OR m."user2Id" = :uid', { uid: userId })
                .getRawOne<{ count: string }>()
                .then((r) => parseInt(r?.count ?? '0', 10)),
            em.createQueryBuilder()
                .select('COUNT(*)', 'count')
                .from('swipe_actions', 'sa')
                .where('sa."targetId" = :uid AND sa.action = :action', { uid: userId, action: 'like' })
                .getRawOne<{ count: string }>()
                .then((r) => parseInt(r?.count ?? '0', 10)),
        ]);

        return {
            totalMatches,
            likesReceived,
            memberSince: user.createdAt,
            profileCompletionStep: user.profileSetupStep,
        };
    }
    async deleteAccount(userId: string) {
        await this.userRepo.update(userId, { isActive: false, email: `deleted_${userId}@deleted.com` });
        return { message: 'Akun berhasil dihapus' };
    }
}
