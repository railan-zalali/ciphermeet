// ─── User Types ───────────────────────────────────────────────────────────────
export type Gender = 'male' | 'female' | 'other';
export type MbtiType =
    | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
    | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
    | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
    | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';
export type SubscriptionTier = 'free' | 'gold' | 'platinum';

export interface User {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: Gender;
    photos: string[];
    bio?: string;
    mbti?: MbtiType;
    interests: string[];
    city?: string;
    latitude?: number;
    longitude?: number;
    isVerified: boolean;
    isPhoneVerified: boolean;
    subscriptionTier: SubscriptionTier;
    profileSetupStep: number;
    isTotpEnabled: boolean;
    createdAt: string;
}

export interface PublicProfile {
    id: string; fullName: string; age: number; city?: string;
    photos: string[]; bio?: string; interests: string[];
    isVerified: boolean; mbti?: MbtiType; distanceKm?: number;
}
