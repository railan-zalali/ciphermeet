import React from 'react';
import {
    View, Text, ScrollView, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity,
} from 'react-native';
// Switch is handled internally by CSwitch component
import { useNavigation } from '@react-navigation/native';
import { Colors, FontSize, FontFamily, Spacing, BorderRadius, MinTouchTarget } from '../../theme';
import { CSwitch } from '../../components/atoms/CSwitch/CSwitch';

interface SettingItem {
    id: string;
    title: string;
    desc: string;
    value: boolean;
    onChange: (v: boolean) => void;
}

const useAccessibilityState = () => {
    const [reducedMotion, setReducedMotion] = React.useState(false);
    const [highContrast, setHighContrast] = React.useState(false);
    const [largeText, setLargeText] = React.useState(false);
    const [haptics, setHaptics] = React.useState(true);
    const [autoPlayVoice, setAutoPlayVoice] = React.useState(false);
    const [screenReader, setScreenReader] = React.useState(false);
    return {
        reducedMotion, setReducedMotion,
        highContrast, setHighContrast,
        largeText, setLargeText,
        haptics, setHaptics,
        autoPlayVoice, setAutoPlayVoice,
        screenReader, setScreenReader,
    };
};

export const AccessibilitySettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const {
        reducedMotion, setReducedMotion,
        highContrast, setHighContrast,
        largeText, setLargeText,
        haptics, setHaptics,
        autoPlayVoice, setAutoPlayVoice,
    } = useAccessibilityState();

    const sections: { title: string; items: SettingItem[] }[] = [
        {
            title: 'Tampilan',
            items: [
                {
                    id: 'highContrast', title: 'Kontras Tinggi', value: highContrast, onChange: setHighContrast,
                    desc: 'Meningkatkan kontras warna untuk keterbacaan lebih baik',
                },
                {
                    id: 'largeText', title: 'Teks Lebih Besar', value: largeText, onChange: setLargeText,
                    desc: 'Memperbesar ukuran teks di seluruh aplikasi',
                },
            ],
        },
        {
            title: 'Animasi & Gerakan',
            items: [
                {
                    id: 'reducedMotion', title: 'Kurangi Animasi', value: reducedMotion, onChange: setReducedMotion,
                    desc: 'Minimalkan efek animasi dan transisi (direkomendasikan jika mengalami mabuk gerak)',
                },
            ],
        },
        {
            title: 'Audio & Haptic',
            items: [
                {
                    id: 'haptics', title: 'Getaran (Haptic)', value: haptics, onChange: setHaptics,
                    desc: 'Umpan balik getaran saat swipe dan interaksi',
                },
                {
                    id: 'autoPlayVoice', title: 'Auto-Play Voice Note', value: autoPlayVoice, onChange: setAutoPlayVoice,
                    desc: 'Putar voice note secara otomatis saat dibuka',
                },
            ],
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Kembali"
                >
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title} accessibilityRole="header">Aksesibilitas</Text>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                {/* WCAG note */}
                <View style={styles.wcagNote}>
                    <Text style={styles.wcagText}>
                        ♿ CipherMeet dirancang sesuai standar WCAG 2.1 Level AA untuk memastikan
                        dapat digunakan oleh semua orang.
                    </Text>
                </View>

                {sections.map((section) => (
                    <View key={section.title} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {section.items.map((item, i) => (
                            <View
                                key={item.id}
                                style={[styles.settingRow, i < section.items.length - 1 && styles.settingRowBorder]}
                            >
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingTitle}>{item.title}</Text>
                                    <Text style={styles.settingDesc}>{item.desc}</Text>
                                </View>
                                <CSwitch
                                    label={item.title}
                                    value={item.value}
                                    onChange={item.onChange}
                                    description={item.desc}
                                />
                            </View>
                        ))}
                    </View>
                ))}

                {/* Info box */}
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>🔠 TalkBack / Screen Reader</Text>
                    <Text style={styles.infoDesc}>
                        CipherMeet sepenuhnya kompatibel dengan TalkBack (Android) dan VoiceOver (iOS).
                        Semua elemen interaktif memiliki label aksesibilitas yang tepat.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: Spacing.md },
    backBtn: { minHeight: MinTouchTarget, minWidth: MinTouchTarget, alignItems: 'center', justifyContent: 'center' },
    backText: { color: Colors.primary, fontSize: FontSize.xl, fontFamily: FontFamily.bodyBold },
    title: { fontFamily: FontFamily.displayFallback, fontSize: FontSize.xl, color: Colors.textPrimary, fontWeight: '700' },
    scroll: { flex: 1 },
    scrollContent: { padding: Spacing.lg, gap: Spacing.md },
    wcagNote: { backgroundColor: 'rgba(124,92,252,0.08)', borderRadius: BorderRadius.md, padding: Spacing.md, borderLeftWidth: 3, borderLeftColor: Colors.primary },
    wcagText: { fontFamily: FontFamily.body, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
    section: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, overflow: 'hidden' },
    sectionTitle: { fontFamily: FontFamily.bodyBold, fontSize: FontSize.sm, color: Colors.textSecondary, paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
    settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: Spacing.md },
    settingRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
    settingInfo: { flex: 1 },
    settingTitle: { fontFamily: FontFamily.bodyMedium, fontSize: FontSize.md, color: Colors.textPrimary },
    settingDesc: { fontFamily: FontFamily.body, fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
    infoBox: { backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.md, gap: Spacing.sm },
    infoTitle: { fontFamily: FontFamily.bodyBold, fontSize: FontSize.md, color: Colors.textPrimary },
    infoDesc: { fontFamily: FontFamily.body, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
});
