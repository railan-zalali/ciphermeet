import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export enum MbtiType {
    INTJ = 'INTJ', INTP = 'INTP', ENTJ = 'ENTJ', ENTP = 'ENTP',
    INFJ = 'INFJ', INFP = 'INFP', ENFJ = 'ENFJ', ENFP = 'ENFP',
    ISTJ = 'ISTJ', ISFJ = 'ISFJ', ESTJ = 'ESTJ', ESFJ = 'ESFJ',
    ISTP = 'ISTP', ISFP = 'ISFP', ESTP = 'ESTP', ESFP = 'ESFP',
}

export enum SubscriptionTier {
    FREE = 'free',
    GOLD = 'gold',
    PLATINUM = 'platinum',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    fullName: string;

    @Index({ unique: true })
    @Column({ unique: true })
    email: string;

    @Index({ unique: true })
    @Column({ unique: true, nullable: true })
    phoneNumber: string;

    @Column({ select: false })
    passwordHash: string;

    @Column({ nullable: true })
    dateOfBirth: Date;

    @Column({ type: 'enum', enum: Gender, nullable: true })
    gender: Gender;

    @Column({ type: 'simple-array', nullable: true })
    photos: string[];

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ type: 'enum', enum: MbtiType, nullable: true })
    mbti: MbtiType;

    @Column({ type: 'simple-array', nullable: true })
    interests: string[];

    // Partner preferences
    @Column({ default: 18 })
    preferredAgeMin: number;

    @Column({ default: 50 })
    preferredAgeMax: number;

    @Column({ default: 50 })
    preferredMaxDistanceKm: number;

    @Column({ type: 'simple-array', nullable: true })
    preferredGenders: string[];

    // Geolocation
    @Column({ type: 'float', nullable: true })
    latitude: number;

    @Column({ type: 'float', nullable: true })
    longitude: number;

    @Column({ nullable: true })
    city: string;

    // Status flags
    @Column({ default: false })
    isVerified: boolean;

    @Column({ default: false })
    isPhoneVerified: boolean;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isIncognito: boolean;

    @Column({ default: true })
    showDistance: boolean;

    @Column({ default: true })
    showLastActive: boolean;

    @Column({ type: 'enum', enum: SubscriptionTier, default: SubscriptionTier.FREE })
    subscriptionTier: SubscriptionTier;

    @Column({ nullable: true })
    subscriptionExpiresAt: Date;

    // Wizard completion
    @Column({ default: 0 })
    profileSetupStep: number;

    // Signal Protocol identity key (public key, base64)
    @Column({ nullable: true })
    identityPublicKey: string;

    // 2FA
    @Column({ nullable: true, select: false })
    totpSecret: string;

    @Column({ default: false })
    isTotpEnabled: boolean;

    @Column({ nullable: true })
    lastActiveAt: Date;

    // FCM push notification token (updated by mobile)
    @Column({ nullable: true, select: false })
    fcmToken: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
