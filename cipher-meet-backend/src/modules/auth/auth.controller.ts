import {
    Controller, Post, Body, UseGuards, Get, Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyOtpDto, RefreshTokenDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register akun baru' })
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('verify-otp')
    @ApiOperation({ summary: 'Verifikasi OTP nomor HP' })
    verifyOtp(@Body() dto: VerifyOtpDto) {
        return this.authService.verifyOtp(dto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login dengan email/HP + password' })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    refresh(@Body() dto: RefreshTokenDto) {
        return this.authService.refreshTokens(dto.refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout dari sesi aktif' })
    logout(@CurrentUser() user: JwtPayload, @Req() req: any) {
        const deviceId = req.headers['x-device-id'] as string | undefined;
        return this.authService.logout(user.sub, deviceId);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Dapatkan info user yang sedang login' })
    me(@CurrentUser() user: JwtPayload) {
        return user;
    }
}
