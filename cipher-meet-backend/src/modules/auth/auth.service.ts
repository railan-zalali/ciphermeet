import {
    Injectable, ConflictException, UnauthorizedException,
    BadRequestException, NotFoundException, Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from '../keys/entities/keys.entities';
import { RegisterDto, LoginDto, VerifyOtpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(RefreshToken) private refreshTokenRepo: Repository<RefreshToken>,
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectRedis() private redis: Redis,
    ) { }

    // ─── Register ────────────────────────────────────────────────────────────────
    async register(dto: RegisterDto) {
        const existingEmail = await this.userRepo.findOne({ where: { email: dto.email } });
        if (existingEmail) throw new ConflictException('Email sudah terdaftar');

        const existingPhone = await this.userRepo.findOne({ where: { phoneNumber: dto.phoneNumber } });
        if (existingPhone) throw new ConflictException('Nomor HP sudah terdaftar');

        const passwordHash = await argon2.hash(dto.password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 4,
        });

        const user = this.userRepo.create({
            fullName: dto.fullName,
            email: dto.email,
            phoneNumber: dto.phoneNumber,
            passwordHash,
            dateOfBirth: new Date(dto.dateOfBirth),
            gender: dto.gender,
        });

        await this.userRepo.save(user);

        // Send OTP
        await this.sendOtp(dto.phoneNumber);

        return { message: 'Registrasi berhasil. Periksa SMS untuk kode OTP.' };
    }

    // ─── OTP ─────────────────────────────────────────────────────────────────────
    async sendOtp(phoneNumber: string): Promise<void> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const ttl = this.configService.get<number>('otp.ttlSeconds') ?? 300;
        const key = `otp:${phoneNumber}`;

        await this.redis.setex(key, ttl, otp);
        // In production: integrate with Twilio / Vonage / local SMS gateway
        this.logger.log(`OTP for ${phoneNumber}: ${otp} (dev mode)`);
    }

    async verifyOtp(dto: VerifyOtpDto) {
        const key = `otp:${dto.phoneNumber}`;
        const stored = await this.redis.get(key);

        if (!stored || stored !== dto.otp) {
            throw new BadRequestException('Kode OTP tidak valid atau sudah kadaluarsa');
        }

        await this.redis.del(key);

        const user = await this.userRepo.findOne({ where: { phoneNumber: dto.phoneNumber } });
        if (!user) throw new NotFoundException('Pengguna tidak ditemukan');

        user.isPhoneVerified = true;
        await this.userRepo.save(user);

        return this.generateTokens(user);
    }

    // ─── Login ───────────────────────────────────────────────────────────────────
    async login(dto: LoginDto) {
        const user = await this.userRepo.findOne({
            where: [{ email: dto.emailOrPhone }, { phoneNumber: dto.emailOrPhone }],
            select: ['id', 'email', 'fullName', 'passwordHash', 'isActive'],
        });

        if (!user) throw new UnauthorizedException('Email atau password salah');
        if (!user.isActive) throw new UnauthorizedException('Akun telah dinonaktifkan');

        const isValid = await argon2.verify(user.passwordHash, dto.password);
        if (!isValid) throw new UnauthorizedException('Email atau password salah');

        await this.userRepo.update(user.id, { lastActiveAt: new Date() });

        const tokens = await this.generateTokens(user, dto.deviceId, dto.deviceName);
        return tokens;
    }

    // ─── Token Generation ────────────────────────────────────────────────────────
    async generateTokens(user: User, deviceId?: string, deviceName?: string) {
        const payload = { sub: user.id, email: user.email, username: user.fullName };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('jwt.secret'),
            expiresIn: this.configService.get<string>('jwt.expiresIn'),
        });

        const refreshTokenValue = uuidv4();
        const refreshTokenHash = await argon2.hash(refreshTokenValue, { type: argon2.argon2id });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.refreshTokenRepo.save({
            userId: user.id,
            tokenHash: refreshTokenHash,
            deviceId: deviceId ?? uuidv4(),
            deviceName,
            expiresAt,
        });

        return {
            accessToken,
            refreshToken: refreshTokenValue,
            user: { id: user.id, email: user.email, fullName: user.fullName },
        };
    }

    // ─── Refresh ─────────────────────────────────────────────────────────────────
    async refreshTokens(refreshToken: string) {
        const tokens = await this.refreshTokenRepo.find({ where: { isRevoked: false } });

        let validToken: RefreshToken | null = null;
        for (const token of tokens) {
            try {
                const isValid = await argon2.verify(token.tokenHash, refreshToken);
                if (isValid && token.expiresAt > new Date()) {
                    validToken = token;
                    break;
                }
            } catch { }
        }

        if (!validToken) throw new UnauthorizedException('Refresh token tidak valid');

        // Rotate the token
        await this.refreshTokenRepo.update(validToken.id, { isRevoked: true });

        const user = await this.userRepo.findOne({ where: { id: validToken.userId } });
        if (!user) throw new NotFoundException('Pengguna tidak ditemukan');

        return this.generateTokens(user, validToken.deviceId, validToken.deviceName);
    }

    // ─── Logout ──────────────────────────────────────────────────────────────────
    async logout(userId: string, deviceId?: string) {
        await this.refreshTokenRepo.update(
            { userId, ...(deviceId ? { deviceId } : {}) },
            { isRevoked: true },
        );
        return { message: 'Berhasil logout' };
    }
}
