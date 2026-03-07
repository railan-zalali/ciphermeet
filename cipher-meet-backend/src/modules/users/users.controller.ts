import {
    Controller, Get, Patch, Delete, Param, Body, UseGuards, Post,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { UsersService, UpdateProfileDto } from './users.service';
import { IsNumber } from 'class-validator';

class LocationDto {
    @IsNumber() latitude: number;
    @IsNumber() longitude: number;
}

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    @ApiOperation({ summary: 'Profil saya' })
    getMyProfile(@CurrentUser() user: JwtPayload) {
        return this.usersService.getProfile(user.sub);
    }

    @Patch('me')
    @ApiOperation({ summary: 'Update profil' })
    updateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
        return this.usersService.updateProfile(user.sub, dto);
    }

    @Post('me/location')
    @ApiOperation({ summary: 'Update lokasi pengguna' })
    updateLocation(@CurrentUser() user: JwtPayload, @Body() dto: LocationDto) {
        return this.usersService.updateLocation(user.sub, dto.latitude, dto.longitude);
    }

    @Get('me/stats')
    @ApiOperation({ summary: 'Statistik profil (match, likes, dll)' })
    getStats(@CurrentUser() user: JwtPayload) {
        return this.usersService.getStats(user.sub);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Lihat profil publik pengguna lain' })
    getPublicProfile(@Param('id') id: string) {
        return this.usersService.getPublicProfile(id);
    }

    @Delete('me')
    @ApiOperation({ summary: 'Hapus akun (soft delete)' })
    deleteAccount(@CurrentUser() user: JwtPayload) {
        return this.usersService.deleteAccount(user.sub);
    }
}
