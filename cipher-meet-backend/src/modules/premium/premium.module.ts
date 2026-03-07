import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PremiumController } from './premium.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [PremiumController],
})
export class PremiumModule { }
