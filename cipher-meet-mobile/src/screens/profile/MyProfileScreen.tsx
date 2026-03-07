import React from 'react';
import {
    View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity,
} from 'react-native';
import { Colors, FontSize, FontFamily, Spacing, MinTouchTarget, BorderRadius } from '../../theme';
import { CAvatar } from '../../components/atoms/CAvatar/CAvatar';
import { useAuthStore } from '../../stores/authStore';

export const MyProfileScreen: React.FC = () => {
    const { user, logout } = useAuthStore();

    const STATS = [
        { label: 'Total Match', value: '12' },
        { label: 'Likes Diterima', value: '47' },
        { label: 'Member Sejak', value: 'Mar 2026' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <ScrollView contentContainerStyle={styles.content}>
                {/* Profile header */}
                <View style={styles.profileHeader}>
                    <CAvatar
                        name={user?.fullName ?? 'User'}
                        size="xl"
                        isVerified={user?.isVerified}
                        accessibilityLabel={`Foto profil ${user?.fullName ?? 'saya'}`}
                    />
                    <Text style={styles.name} accessibilityRole="header">{user?.fullName ?? 'User'}</Text>
                    {user?.isVerified && (
                        <View style={styles.verifiedRow}>
                            <Text style={styles.verifiedText}>✓ Terverifikasi</Text>
                        </View>
                    )}
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    {STATS.map((stat) => (
                        <View key={stat.label} style={styles.statItem}>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Menu items */}
                {[
                    { icon: '✏️', label: 'Edit Profil', a11y: 'Edit profil saya' },
                    { icon: '🔒', label: 'Privasi & Keamanan', a11y: 'Buka pengaturan privasi dan keamanan' },
                    { icon: '🛡️', label: 'Security Center', a11y: 'Buka security center untuk 2FA dan sesi aktif' },
                    { icon: '♿', label: 'Aksesibilitas', a11y: 'Buka pengaturan aksesibilitas' },
                    { icon: '💎', label: 'Upgrade Premium', a11y: 'Lihat paket premium' },
                    { icon: '❓', label: 'Bantuan & FAQ', a11y: 'Buka halaman bantuan' },
                ].map((item) => (
                    <TouchableOpacity
                        key={item.label}
                        style={styles.menuItem}
                        accessibilityRole="button"
                        accessibilityLabel={item.a11y}
                    >
                        <Text style={styles.menuIcon}>{item.icon}</Text>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                        <Text style={styles.menuChevron}>›</Text>
                    </TouchableOpacity>
                ))}

                {/* Logout */}
                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={logout}
                    accessibilityRole="button"
                    accessibilityLabel="Keluar dari akun"
                >
                    <Text style={styles.logoutText}>Keluar</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { paddingBottom: Spacing['3xl'] },
    profileHeader: { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.md },
    name: { fontFamily: FontFamily.displayFallback, fontSize: FontSize['2xl'], color: Colors.textPrimary, fontWeight: '700' },
    verifiedRow: { backgroundColor: 'rgba(34,211,165,0.1)', borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: 4 },
    verifiedText: { color: Colors.success, fontFamily: FontFamily.bodyMedium, fontSize: FontSize.sm },
    statsRow: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border },
    statItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing.lg },
    statValue: { fontFamily: FontFamily.bodyBold, fontSize: FontSize.xl, color: Colors.primary },
    statLabel: { fontFamily: FontFamily.body, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
    menuItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: Spacing.lg, minHeight: MinTouchTarget,
        gap: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    menuIcon: { fontSize: 20, width: 32 },
    menuLabel: { flex: 1, fontFamily: FontFamily.bodyMedium, fontSize: FontSize.md, color: Colors.textPrimary },
    menuChevron: { color: Colors.textDisabled, fontSize: FontSize.xl },
    logoutBtn: { marginHorizontal: Spacing.lg, marginTop: Spacing.xl, borderWidth: 1.5, borderColor: Colors.error, borderRadius: BorderRadius.md, minHeight: MinTouchTarget, alignItems: 'center', justifyContent: 'center' },
    logoutText: { color: Colors.error, fontFamily: FontFamily.bodyBold, fontSize: FontSize.md },
});
