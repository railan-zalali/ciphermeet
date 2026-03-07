import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, FontSize, FontFamily, Spacing, BorderRadius, Shadow } from '../../../theme';
import { CChip } from '../../atoms/CChip/CChip';

export interface ProfileCardData {
    id: string;
    name: string;
    age: number;
    city?: string;
    distanceKm?: number;
    photos: string[];
    bio?: string;
    interests?: string[];
    isVerified?: boolean;
}

interface ProfileCardProps {
    profile: ProfileCardData;
    onPress?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onPress }) => {
    const mainPhoto = profile.photos?.[0];
    const age = profile.age;
    const a11yLabel = `Foto profil ${profile.name}, ${age} tahun${profile.city ? ` dari ${profile.city}` : ''}${profile.distanceKm ? `, ${profile.distanceKm} km darimu` : ''}${profile.isVerified ? ', profil terverifikasi' : ''}`;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.97}
            accessible
            accessibilityRole="button"
            accessibilityLabel={a11yLabel}
            accessibilityHint="Tekan untuk melihat profil lengkap"
        >
            <ImageBackground
                source={mainPhoto ? { uri: mainPhoto } : undefined}
                style={styles.image}
                imageStyle={{ borderRadius: BorderRadius.lg }}
                accessible={false}
            >
                {/* Dark gradient overlay */}
                <LinearGradient
                    colors={['transparent', 'rgba(10,10,15,0.85)', '#0A0A0F']}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <View style={styles.info}>
                        {/* Name, age, distance */}
                        <View style={styles.nameRow}>
                            <Text style={styles.name} numberOfLines={1}>
                                {profile.name}, {age}
                            </Text>
                            {profile.isVerified && (
                                <View
                                    style={styles.verifiedBadge}
                                    accessibilityLabel="Profil terverifikasi"
                                >
                                    <Text style={styles.verifiedIcon}>✓</Text>
                                </View>
                            )}
                        </View>

                        {/* Location + distance */}
                        {(profile.city || profile.distanceKm) && (
                            <Text style={styles.location}>
                                📍 {profile.city}{profile.distanceKm ? ` · ${profile.distanceKm} km` : ''}
                            </Text>
                        )}

                        {/* Bio snippet */}
                        {profile.bio ? (
                            <Text style={styles.bio} numberOfLines={2}>
                                {profile.bio.slice(0, 80)}{profile.bio.length > 80 ? '...' : ''}
                            </Text>
                        ) : null}

                        {/* Interest chips */}
                        {profile.interests && profile.interests.length > 0 && (
                            <View style={styles.chips}>
                                {profile.interests.slice(0, 3).map((interest) => (
                                    <CChip
                                        key={interest}
                                        label={interest}
                                        variant="filled"
                                        style={styles.chip}
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        backgroundColor: Colors.card,
        ...Shadow.card,
    },
    image: {
        width: '100%',
        aspectRatio: 0.7,
        justifyContent: 'flex-end',
    },
    gradient: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.lg,
        paddingTop: Spacing['2xl'],
    },
    info: { gap: Spacing.xs },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    name: {
        fontFamily: FontFamily.displayFallback,
        fontSize: FontSize['2xl'],
        color: Colors.textPrimary,
        fontWeight: '700',
        flex: 1,
    },
    verifiedBadge: {
        backgroundColor: Colors.success,
        borderRadius: BorderRadius.full,
        width: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifiedIcon: { color: '#fff', fontSize: 12, fontWeight: '700' },
    location: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    bio: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.sm,
        color: Colors.textPrimary,
        opacity: 0.85,
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 },
    chip: {
        backgroundColor: 'rgba(124,92,252,0.2)',
        borderColor: 'rgba(124,92,252,0.4)',
    },
});
