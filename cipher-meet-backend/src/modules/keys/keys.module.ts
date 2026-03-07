import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeysController } from './keys.controller';
import { KeysService } from './keys.service';
import { PreKeyBundle, OneTimePreKey } from './entities/keys.entities';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PreKeyBundle, OneTimePreKey, User])],
    controllers: [KeysController],
    providers: [KeysService],
    exports: [KeysService],
})
export class KeysModule { }
