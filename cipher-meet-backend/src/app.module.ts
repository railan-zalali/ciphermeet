import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';
import { RedisModule } from '@nestjs-modules/ioredis';

import configuration from './config/configuration';

// Entities
import { User } from './modules/users/entities/user.entity';
import { SwipeAction, Match } from './modules/discovery/entities/discovery.entities';
import { PreKeyBundle, OneTimePreKey, RefreshToken } from './modules/keys/entities/keys.entities';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DiscoveryModule } from './modules/discovery/discovery.module';
import { ChatModule } from './modules/chat/chat.module';
import { KeysModule } from './modules/keys/keys.module';
import { SecurityModule } from './modules/security/security.module';
import { PremiumModule } from './modules/premium/premium.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MediaModule } from './modules/media/media.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.local'],
    }),

    // Event Emitter (for match events)
    EventEmitterModule.forRoot(),

    // PostgreSQL via TypeORM
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.postgres.host'),
        port: config.get<number>('database.postgres.port'),
        username: config.get<string>('database.postgres.username'),
        password: config.get<string>('database.postgres.password'),
        database: config.get<string>('database.postgres.database'),
        entities: [User, SwipeAction, Match, PreKeyBundle, OneTimePreKey, RefreshToken],
        synchronize: config.get<string>('nodeEnv') !== 'production',
        logging: config.get<string>('nodeEnv') === 'development',
        ssl: config.get<string>('nodeEnv') === 'production' ? { rejectUnauthorized: false } : false,
      }),
    }),

    // MongoDB via Mongoose
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('database.mongodb.uri'),
      }),
    }),

    // Redis (ioredis)
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: `redis://${config.get<string>('redis.host')}:${config.get<number>('redis.port')}`,
        options: {
          password: config.get<string>('redis.password') || undefined,
        },
      }),
    }),

    // BullMQ (job queues)
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('redis.host'),
          port: config.get<number>('redis.port'),
          password: config.get<string>('redis.password') || undefined,
        },
      }),
    }),

    // Feature Modules
    AuthModule,
    UsersModule,
    DiscoveryModule,
    ChatModule,
    KeysModule,
    SecurityModule,
    PremiumModule,
    NotificationsModule,
    MediaModule,
  ],
})
export class AppModule { }
