import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { DiscoveryService } from './discovery.service';
import { SwipeActionType } from './entities/discovery.entities';

class SwipeDto {
    @IsString() targetId: string;
    @IsEnum(SwipeActionType) action: SwipeActionType;
}

@ApiTags('discovery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('discovery')
export class DiscoveryController {
    constructor(private readonly discoveryService: DiscoveryService) { }

    @Get('feed')
    @ApiOperation({ summary: 'Dapatkan kartu profil untuk diswipe' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    getFeed(
        @CurrentUser() user: JwtPayload,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ) {
        return this.discoveryService.getFeed(user.sub, +page, +limit);
    }

    @Post('swipe')
    @ApiOperation({ summary: 'Swipe profil (like/pass/super_like)' })
    swipe(@CurrentUser() user: JwtPayload, @Body() dto: SwipeDto) {
        return this.discoveryService.swipe(user.sub, dto.targetId, dto.action);
    }

    @Get('matches')
    @ApiOperation({ summary: 'Daftar match yang sudah terjadi' })
    getMatches(@CurrentUser() user: JwtPayload) {
        return this.discoveryService.getMatches(user.sub);
    }
}
