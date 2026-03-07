import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum SwipeActionType {
    LIKE = 'like',
    PASS = 'pass',
    SUPER_LIKE = 'super_like',
}

@Entity('swipe_actions')
@Index(['userId', 'targetId'], { unique: true })
export class SwipeAction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    userId: string;

    @Column()
    @Index()
    targetId: string;

    @Column({ type: 'enum', enum: SwipeActionType })
    action: SwipeActionType;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'targetId' })
    target: User;

    @CreateDateColumn()
    createdAt: Date;
}

@Entity('matches')
export class Match {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    user1Id: string;

    @Column()
    @Index()
    user2Id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user1Id' })
    user1: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user2Id' })
    user2: User;

    @Column({ default: false })
    isBlocked: boolean;

    @Column({ nullable: true })
    blockedBy: string;

    @CreateDateColumn()
    matchedAt: Date;
}
