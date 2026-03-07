import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';
import { SwipeAction, Match } from './entities/discovery.entities';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, SwipeAction, Match]),
        EventEmitterModule,
    ],
    controllers: [DiscoveryController],
    providers: [DiscoveryService],
    exports: [DiscoveryService],
})
export class DiscoveryModule { }
