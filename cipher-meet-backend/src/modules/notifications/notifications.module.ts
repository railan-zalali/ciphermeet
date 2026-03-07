import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsProcessor } from './notifications.processor';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        BullModule.registerQueue({ name: 'notifications' }),
    ],
    providers: [NotificationsService, NotificationsProcessor],
    controllers: [NotificationsController],
    exports: [NotificationsService],
})
export class NotificationsModule { }
