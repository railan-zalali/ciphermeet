import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, SubscriptionTier } from '../users/entities/user.entity';

const PLANS = [
    {
        id: 'gold', name: 'Gold', price: 79000, currency: 'IDR', period: 'month',
        features: ['Unlimited Swipes', 'See Who Liked You', '5 Super Likes/day', 'Incognito Mode']
    },
    {
        id: 'platinum', name: 'Platinum', price: 149000, currency: 'IDR', period: 'month',
        features: ['All Gold features', 'Priority in Discovery', 'Read Receipts', 'Profile Boosts', 'Unlimited Super Likes']
    },
];

class SubscribeDto {
    @IsString() planId: string;
    @IsString() paymentToken: string; // From payment gateway (e.g. Midtrans)
}

@ApiTags('premium')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('premium')
export class PremiumController {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
    ) { }

    @Get('plans')
    @ApiOperation({ summary: 'Daftar paket premium' })
    getPlans() {
        return PLANS;
    }

    @Get('status')
    @ApiOperation({ summary: 'Status langganan aktif' })
    async getStatus(@CurrentUser() user: JwtPayload) {
        const u = await this.userRepo.findOne({
            where: { id: user.sub },
            select: ['subscriptionTier', 'subscriptionExpiresAt'],
        });
        return {
            tier: u?.subscriptionTier ?? SubscriptionTier.FREE,
            expiresAt: u?.subscriptionExpiresAt,
            isActive: u?.subscriptionExpiresAt ? u.subscriptionExpiresAt > new Date() : false,
        };
    }

    @Post('subscribe')
    @ApiOperation({ summary: 'Berlangganan paket premium' })
    async subscribe(@CurrentUser() user: JwtPayload, @Body() dto: SubscribeDto) {
        const plan = PLANS.find((p) => p.id === dto.planId);
        if (!plan) return { error: 'Paket tidak ditemukan' };

        // In production: verify paymentToken with Midtrans/payment gateway
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);

        await this.userRepo.update(user.sub, {
            subscriptionTier: dto.planId === 'platinum' ? SubscriptionTier.PLATINUM : SubscriptionTier.GOLD,
            subscriptionExpiresAt: expiresAt,
        });

        return {
            message: `Berlangganan ${plan.name} berhasil!`,
            tier: dto.planId,
            expiresAt,
        };
    }
}
