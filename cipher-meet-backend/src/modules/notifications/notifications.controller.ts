import { Controller, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

class UpdateFcmDto { @IsString() token: string; }

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Patch('fcm-token')
    @ApiOperation({ summary: 'Update FCM device token' })
    updateToken(@CurrentUser() user: any, @Body() dto: UpdateFcmDto) {
        return this.notificationsService.updateFcmToken(user.sub as string, dto.token);
    }
}
