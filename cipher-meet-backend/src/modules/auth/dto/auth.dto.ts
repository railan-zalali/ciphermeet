import { IsEmail, IsString, MinLength, IsEnum, IsDateString, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../users/entities/user.entity';

export class RegisterDto {
    @ApiProperty({ example: 'Budi Santoso' })
    @IsString()
    fullName: string;

    @ApiProperty({ example: 'budi@example.com' })
    @IsEmail({}, { message: 'Format email tidak valid' })
    email: string;

    @ApiProperty({ example: '081234567890' })
    @Matches(/^(08|\+628)[0-9]{8,11}$/, {
        message: 'Nomor HP tidak valid. Gunakan format: 08xxxxxxxxxx',
    })
    phoneNumber: string;

    @ApiProperty({ minLength: 8 })
    @IsString()
    @MinLength(8, { message: 'Password minimal 8 karakter' })
    password: string;

    @ApiProperty({ example: '1998-01-15' })
    @IsDateString()
    dateOfBirth: string;

    @ApiProperty({ enum: Gender })
    @IsEnum(Gender)
    gender: Gender;
}

export class LoginDto {
    @ApiProperty({ example: 'budi@example.com' })
    @IsString()
    emailOrPhone: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    deviceId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    deviceName?: string;
}

export class VerifyOtpDto {
    @ApiProperty({ example: '081234567890' })
    @IsString()
    phoneNumber: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    otp: string;
}

export class RefreshTokenDto {
    @ApiProperty()
    @IsString()
    refreshToken: string;
}

export class BiometricTokenDto {
    @ApiProperty()
    @IsString()
    deviceId: string;
}
