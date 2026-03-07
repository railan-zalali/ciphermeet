import React, { useEffect } from 'react';
import {
    View, Text, StyleSheet, StatusBar, SafeAreaView,
} from 'react-native';
import { Colors, Spacing, FontSize, FontFamily } from '../../theme';
import { SwipeStack } from '../../components/organisms/SwipeStack/SwipeStack';
import { useDiscoveryStore } from '../../stores/discoveryStore';

// Mock data for development
const MOCK_PROFILES = Array.from({ length: 10 }, (_, i) => ({
    id: `profile-${i}`,
    name: ['Sari', 'Budi', 'Dewi', 'Andi', 'Rina'][i % 5],
    age: 22 + (i % 10),
    city: ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali'][i % 5],
    distanceKm: (i + 1) * 3,
    photos: [],
    bio: 'Suka traveling, kopi, dan buku-buku filsafat. Mencari koneksi yang tulus.',
    interests: ['🎮 Gaming', '☕ Kopi', '📚 Membaca', '🏃 Olahraga'].slice(0, 3),
    isVerified: i % 3 === 0,
}));

export const DiscoveryScreen: React.FC = () => {
    const { profiles, setProfiles, removeTopProfile } = useDiscoveryStore();

    useEffect(() => {
        if (profiles.length === 0) {
            setProfiles(MOCK_PROFILES);
        }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo} accessibilityRole="header">🔐 CipherMeet</Text>
                <View style={styles.headerRight}>
                    <Text style={styles.headerIcon} accessibilityLabel="Filter pencarian">⚙️</Text>
                </View>
            </View>

            {/* Swipe Stack */}
            <View style={styles.stackContainer}>
                <SwipeStack
                    profiles={profiles}
                    onSwipe={(profileId, direction) => {
                        console.log(`Swiped ${direction} on ${profileId}`);
                        removeTopProfile();
                        // TODO: call discovery.swipe API
                    }}
                    onCardPress={(profile) => {
                        console.log('View profile:', profile.id);
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    },
    logo: { fontFamily: FontFamily.bodyBold, fontSize: FontSize.xl, color: Colors.textPrimary },
    headerRight: { flexDirection: 'row', gap: Spacing.md },
    headerIcon: { fontSize: 22 },
    stackContainer: { flex: 1, paddingHorizontal: Spacing.lg, paddingBottom: Spacing['2xl'] },
});
