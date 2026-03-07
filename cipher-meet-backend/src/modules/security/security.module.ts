import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from '../keys/entities/keys.entities';

@Module({
    imports: [TypeOrmModule.forFeature([User, RefreshToken])],
    controllers: [SecurityController],
    providers: [SecurityService],
})
export class SecurityModule { }
