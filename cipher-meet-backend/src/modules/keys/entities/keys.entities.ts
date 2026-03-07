import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, Index,
} from 'typeorm';

@Entity('pre_key_bundles')
export class PreKeyBundle {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column()
    userId: string;

    @Column('text')
    identityPublicKey: string;

    @Column('text')
    signedPreKey: string;

    @Column('text')
    signedPreKeySignature: string;

    @Column('int')
    signedPreKeyId: number;

    @Column({ nullable: true })
    signedPreKeyExpiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;
}

@Entity('one_time_pre_keys')
export class OneTimePreKey {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    userId: string;

    @Column('int')
    keyId: number;

    @Column('text')
    publicKey: string;

    @Column({ default: false })
    isConsumed: boolean;

    @Column({ nullable: true })
    consumedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}

@Entity('refresh_tokens')
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    userId: string;

    @Column('text')
    tokenHash: string;

    @Column()
    deviceId: string;

    @Column({ nullable: true })
    deviceName: string;

    @Column({ nullable: true })
    ipAddress: string;

    @Column({ nullable: true })
    userAgent: string;

    @Column('boolean', { default: false })
    isRevoked: boolean;

    @Column({ nullable: true })
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
