import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { Colors, FontSize, FontFamily, Spacing, MinTouchTarget, BorderRadius } from '../../theme';
import { CSwitch } from '../../components/atoms/CSwitch/CSwitch';

export const PrivacySettingsScreen: React.FC = () => {
    const [showDistance, setShowDistance] = React.useState(true);
    const [showLastActive, setShowLastActive] = React.useState(true);
    const [incognito, setIncognito] = React.useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title} accessibilityRole="header">Privasi</Text>
                <Text style={styles.subtitle}>Kendalikan siapa yang dapat memutuskan informasi kamu</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Visibilitas</Text>
                    <CSwitch value={showDistance} onChange={setShowDistance} label="Tampilkan Jarak" description="Pengguna lain bisa melihat seberapa jauh kamu dari mereka" />
                    <CSwitch value={showLastActive} onChange={setShowLastActive} label="Tampilkan Waktu Aktif" description="Pengguna lain bisa melihat kapan kamu terakhir online" />
                    <CSwitch value={incognito} onChange={setIncognito} label="Mode Incognito 💎" description="Profil kamu tidak muncul di pencarian (fitur Premium)" />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data</Text>
                    <TouchableOpacity style={styles.menuItem} accessibilityRole="button" accessibilityLabel="Ekspor data pribadi saya">
                        <Text style={styles.menuLabel}>📥 Ekspor Data Saya</Text>
                        <Text style={styles.chevron}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.menuItem, styles.dangerItem]} accessibilityRole="button" accessibilityLabel="Hapus akun CipherMeet">
                        <Text style={[styles.menuLabel, styles.dangerLabel]}>🗑️ Hapus Akun</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export const SecurityCenterScreen: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title} accessibilityRole="header">Security Center</Text>
                <Text style={styles.subtitle}>Kelola keamanan akun dan enkripsi E2EE kamu</Text>

                {[
                    { icon: '🔑', label: 'Fingerprint Enkripsi E2EE', desc: 'Verifikasi kunci enkripsi dengan pasanganmu', a11y: 'Lihat fingerprint kunci enkripsi Signal Protocol' },
                    { icon: '📱', label: 'Sesi Aktif', desc: 'Kelola perangkat yang masuk', a11y: 'Buka manajemen sesi aktif dan perangkat' },
                    { icon: '🛡️', label: 'Autentikasi Dua Faktor', desc: 'Tambah lapisan keamanan ekstra', a11y: 'Setup atau kelola autentikasi dua faktor TOTP' },
                    { icon: '📋', label: 'Log Aktivitas', desc: 'Riwayat login dan perubahan akun', a11y: 'Lihat log aktivitas akun' },
                ].map((item) => (
                    <TouchableOpacity
                        key={item.label}
                        style={styles.menuItem}
                        accessibilityRole="button"
                        accessibilityLabel={item.a11y}
                    >
                        <View style={styles.menuIconContainer}><Text style={{ fontSize: 22 }}>{item.icon}</Text></View>
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <Text style={styles.menuDesc}>{item.desc}</Text>
                        </View>
                        <Text style={styles.chevron}>›</Text>
                    </TouchableOpacity>
                ))}

                <View style={styles.e2eeNote}>
                    <Text style={styles.e2eeNoteText}>
                        🔐 <Text style={styles.bold}>Private keys tidak pernah meninggalkan perangkatmu.</Text>{' '}
                        Server CipherMeet hanya menyimpan public keys untuk key exchange.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { padding: Spacing.lg, paddingBottom: Spacing['3xl'] },
    title: { fontFamily: FontFamily.displayFallback, fontSize: FontSize['2xl'], color: Colors.textPrimary, fontWeight: '700', marginBottom: Spacing.sm },
    subtitle: { fontFamily: FontFamily.body, fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.xl },
    section: { marginBottom: Spacing.xl },
    sectionTitle: { fontFamily: FontFamily.bodyBold, fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md, textTransform: 'uppercase', letterSpacing: 1 },
    menuItem: {
        flexDirection: 'row', alignItems: 'center', minHeight: MinTouchTarget,
        paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.md,
    },
    dangerItem: { borderBottomWidth: 0, marginTop: Spacing.md, borderWidth: 1.5, borderColor: Colors.error, borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.md },
    menuLabel: { fontFamily: FontFamily.bodyMedium, fontSize: FontSize.md, color: Colors.textPrimary, flex: 1 },
    dangerLabel: { color: Colors.error },
    menuDesc: { fontFamily: FontFamily.body, fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
    chevron: { color: Colors.textDisabled, fontSize: FontSize.xl },
    menuIconContainer: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center' },
    menuTextContainer: { flex: 1 },
    e2eeNote: { backgroundColor: 'rgba(124,92,252,0.08)', borderRadius: BorderRadius.sm, padding: Spacing.md, marginTop: Spacing.xl, borderWidth: 1, borderColor: Colors.border },
    e2eeNoteText: { fontFamily: FontFamily.body, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
    bold: { fontFamily: FontFamily.bodyBold, color: Colors.textPrimary },
});
