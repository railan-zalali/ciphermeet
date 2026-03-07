import {
    Controller, Post, UseInterceptors, UploadedFile,
    ParseFilePipe, MaxFileSizeValidator, FileTypeValidator,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MediaService } from './media.service';

@ApiTags('media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @Post('upload/photo')
    @ApiOperation({ summary: 'Upload foto profil (max 5 MB, JPEG/PNG/WebP)' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
    uploadPhoto(
        @CurrentUser() user: any,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
                    new FileTypeValidator({ fileType: /image\/(jpeg|png|webp)/ }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.mediaService.uploadProfilePhoto(user.sub as string, file);
    }

    @Post('upload/voice')
    @ApiOperation({ summary: 'Upload voice note (max 2 MB, audio)' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 2 * 1024 * 1024 } }))
    uploadVoice(
        @CurrentUser() user: any,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
                    new FileTypeValidator({ fileType: /audio\/(mpeg|ogg|webm|mp4)/ }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.mediaService.uploadVoiceNote(user.sub as string, file);
    }
}
