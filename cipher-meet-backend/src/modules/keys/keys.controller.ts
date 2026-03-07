import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { KeysService } from './keys.service';

class OneTimePreKeyDto {
    @IsNumber() keyId: number;
    @IsString() publicKey: string;
}

class UploadBundleDto {
    @IsString() identityPublicKey: string;
    @IsString() signedPreKey: string;
    @IsString() signedPreKeySignature: string;
    @IsNumber() signedPreKeyId: number;
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OneTimePreKeyDto)
    @ArrayMinSize(1)
    oneTimePreKeys: OneTimePreKeyDto[];
}

class RotateSignedPreKeyDto {
    @IsString() signedPreKey: string;
    @IsString() signedPreKeySignature: string;
    @IsNumber() signedPreKeyId: number;
}

@ApiTags('keys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('keys')
export class KeysController {
    constructor(private readonly keysService: KeysService) { }

    @Post('bundle')
    @ApiOperation({ summary: 'Upload pre-key bundle (X3DH)' })
    uploadBundle(@CurrentUser() user: JwtPayload, @Body() dto: UploadBundleDto) {
        return this.keysService.uploadBundle(user.sub, dto);
    }

    @Get('bundle/:userId')
    @ApiOperation({ summary: 'Ambil pre-key bundle pengguna lain untuk X3DH key exchange' })
    getBundle(@Param('userId') targetId: string) {
        return this.keysService.getBundle(targetId);
    }

    @Put('signed-prekey')
    @ApiOperation({ summary: 'Rotasi signed pre-key (jadwalkan tiap 7 hari)' })
    rotateSignedPreKey(@CurrentUser() user: JwtPayload, @Body() dto: RotateSignedPreKeyDto) {
        return this.keysService.rotateSignedPreKey(user.sub, dto);
    }
}
