import {
    Controller, Get, Post, Delete, Body,
    Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SecurityService } from './security.service';
import { Verify2FADto } from './dto/security.dto';

@ApiTags('security')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('security')
export class SecurityController {
    constructor(private readonly securityService: SecurityService) { }

    @Post('2fa/setup')
    @ApiOperation({ summary: 'Mulai setup 2FA — dapatkan QR code' })
    setup2FA(@CurrentUser() user: any) {
        return this.securityService.setup2FA(user.sub as string);
    }

    @Post('2fa/verify')
    @ApiOperation({ summary: 'Verifikasi dan aktifkan 2FA' })
    verify2FA(@CurrentUser() user: any, @Body() dto: Verify2FADto) {
        return this.securityService.verify2FA(user.sub as string, dto.code);
    }

    @Delete('2fa')
    @ApiOperation({ summary: 'Nonaktifkan 2FA' })
    disable2FA(@CurrentUser() user: any) {
        return this.securityService.disable2FA(user.sub as string);
    }

    @Get('sessions')
    @ApiOperation({ summary: 'Daftar sesi aktif (perangkat login)' })
    getSessions(@CurrentUser() user: any) {
        return this.securityService.getActiveSessions(user.sub as string);
    }

    @Delete('sessions/:id')
    @ApiOperation({ summary: 'Cabut sesi tertentu' })
    revokeSession(
        @CurrentUser() user: any,
        @Param('id') sessionId: string,
    ) {
        return this.securityService.revokeSession(user.sub as string, sessionId);
    }

    @Delete('sessions')
    @ApiOperation({ summary: 'Logout dari semua perangkat' })
    revokeAll(@CurrentUser() user: any) {
        return this.securityService.revokeAllSessions(user.sub as string);
    }

    @Get('activity-log')
    @ApiOperation({ summary: 'Log aktivitas akun (50 terakhir)' })
    getLog(@CurrentUser() user: any) {
        return this.securityService.getActivityLog(user.sub as string);
    }
}
