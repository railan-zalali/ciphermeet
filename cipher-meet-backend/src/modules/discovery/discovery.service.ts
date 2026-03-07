import {
    Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '../users/entities/user.entity';
import {
    SwipeAction, SwipeActionType, Match,
} from './entities/discovery.entities';

@Injectable()
export class DiscoveryService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(SwipeAction) private swipeRepo: Repository<SwipeAction>,
        @InjectRepository(Match) private matchRepo: Repository<Match>,
        private eventEmitter: EventEmitter2,
    ) { }

    async getFeed(userId: string, page = 1, limit = 10) {
        const currentUser = await this.userRepo.findOne({ where: { id: userId } });
        if (!currentUser) throw new NotFoundException('Pengguna tidak ditemukan');

        // Get already-swiped user IDs
        const swiped = await this.swipeRepo.find({ where: { userId }, select: ['targetId'] });
        const swipedIds = swiped.map((s) => s.targetId);

        // Build geo-filtered query
        const query = this.userRepo.createQueryBuilder('u')
            .where('u.id != :userId', { userId })
            .andWhere('u.isActive = true')
            .andWhere('u.profileSetupStep >= 4');

        if (swipedIds.length > 0) {
            query.andWhere('u.id NOT IN (:...swipedIds)', { swipedIds });
        }

        // Geo-distance filter (Haversine formula approximation)
        if (currentUser.latitude && currentUser.longitude) {
            const radiusKm = currentUser.preferredMaxDistanceKm ?? 50;
            const latDelta = radiusKm / 111;
            const lngDelta = radiusKm / (111 * Math.cos((currentUser.latitude * Math.PI) / 180));

            query
                .andWhere('u.latitude BETWEEN :minLat AND :maxLat', {
                    minLat: currentUser.latitude - latDelta,
                    maxLat: currentUser.latitude + latDelta,
                })
                .andWhere('u.longitude BETWEEN :minLng AND :maxLng', {
                    minLng: currentUser.longitude - lngDelta,
                    maxLng: currentUser.longitude + lngDelta,
                });
        }

        // Gender preference filter
        if (currentUser.preferredGenders?.length) {
            query.andWhere('u.gender IN (:...genders)', { genders: currentUser.preferredGenders });
        }

        // Age filter via dateOfBirth
        const today = new Date();
        const maxBirth = new Date(today.getFullYear() - (currentUser.preferredAgeMin ?? 18), today.getMonth(), today.getDate());
        const minBirth = new Date(today.getFullYear() - (currentUser.preferredAgeMax ?? 50), today.getMonth(), today.getDate());
        query.andWhere('u.dateOfBirth BETWEEN :minBirth AND :maxBirth', { minBirth, maxBirth });

        const profiles = await query
            .select([
                'u.id', 'u.fullName', 'u.dateOfBirth', 'u.photos',
                'u.bio', 'u.interests', 'u.city', 'u.isVerified',
                'u.latitude', 'u.longitude', 'u.mbti',
            ])
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();

        return profiles.map((p) => ({
            ...p,
            distanceKm: this.calcDistance(
                currentUser.latitude, currentUser.longitude,
                p.latitude, p.longitude,
            ),
        }));
    }

    async swipe(userId: string, targetId: string, action: SwipeActionType) {
        if (userId === targetId) throw new ForbiddenException('Tidak bisa swipe diri sendiri');

        const target = await this.userRepo.findOne({ where: { id: targetId } });
        if (!target) throw new NotFoundException('Profil tidak ditemukan');

        // Upsert swipe action
        await this.swipeRepo.upsert(
            { userId, targetId, action },
            { conflictPaths: ['userId', 'targetId'] },
        );

        // Check for mutual like → create match
        let match: Match | null = null;
        if (action === SwipeActionType.LIKE || action === SwipeActionType.SUPER_LIKE) {
            const theirSwipe = await this.swipeRepo.findOne({
                where: {
                    userId: targetId,
                    targetId: userId,
                    action: Not(SwipeActionType.PASS),
                },
            });

            if (theirSwipe) {
                const existing = await this.matchRepo.findOne({
                    where: [
                        { user1Id: userId, user2Id: targetId },
                        { user1Id: targetId, user2Id: userId },
                    ],
                });

                if (!existing) {
                    match = await this.matchRepo.save({ user1Id: userId, user2Id: targetId });
                    this.eventEmitter.emit('match.created', { match, user1Id: userId, user2Id: targetId });
                }
            }
        }

        return { action, match: match ? { id: match.id } : null };
    }

    async getMatches(userId: string) {
        return this.matchRepo.find({
            where: [{ user1Id: userId }, { user2Id: userId }],
            relations: ['user1', 'user2'],
            order: { matchedAt: 'DESC' },
        });
    }

    private calcDistance(lat1?: number, lon1?: number, lat2?: number, lon2?: number): number | null {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
        return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }
}
