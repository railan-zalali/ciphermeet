import React from 'react';
import {
    View, Text, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { Colors, FontSize, FontFamily, Spacing, BorderRadius } from '../../theme';
import { CBadge } from '../../components/atoms/CBadge/CBadge';
import { CButton } from '../../components/atoms/CButton/CButton';

const PLANS = [
    {
        id: 'gold',
        name: '✨ Gold',
        price: 'Rp 79.000',
        period: '/bulan',
        color: '#F59E0B',
        badge: 'Populer',
        features: [
            '5 Super Like / hari',
            'Lihat siapa yang suka kamu',
            'Mode Incognito',
            'Boost profil 1x / bulan',
            'Filter pencarian lanjutan',
            'Tanpa iklan',
        ],
    },
    {
        id: 'platinum',
        name: '💎 Platinum',
        price: 'Rp 129.000',
        period: '/bulan',
        color: '#8B5CF6',
        badge: 'Terbaik',
        features: [
            'Super Like tak terbatas',
            'Lihat siapa yang suka kamu',
            'Mode Incognito',
            'Boost profil 4x / bulan',
            'Pesan ke siapa saja (tanpa match)',
            'Badge Platinum eksklusif',
            'Prioritas algorithm discovery',
            'Tanpa iklan',
        ],
    },
];

export const PremiumScreen: React.FC = () => {
    const [selected, setSelected] = React.useState<string>('gold');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <ScrollView contentContainerStyle={styles.scroll}>

                {/* Hero */}
                <View style={styles.hero}>
                    <Text style={styles.heroIcon}>💎</Text>
                    <Text style={styles.heroTitle}>CipherMeet Premium</Text>
                    <Text style={styles.heroSubtitle}>Temukan lebih banyak koneksi bermakna</Text>
                </View>

                {/* Plan cards */}
                {PLANS.map((plan) => (
                    <TouchableOpacity
                        key={plan.id}
                        style={[styles.planCard, selected === plan.id && { borderColor: plan.color, ...styles.planCardSelected }]}
                        onPress={() => setSelected(plan.id)}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selected === plan.id }}
                        accessibilityLabel={`${plan.name} - ${plan.price}${plan.period}`}
                    >
                        <View style={styles.planHeader}>
                            <View>
                                <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                                <View style={styles.priceRow}>
                                    <Text style={styles.price}>{plan.price}</Text>
                                    <Text style={styles.period}>{plan.period}</Text>
                                </View>
                            </View>
                            <CBadge label={plan.badge} variant={plan.id === 'platinum' ? 'primary' : 'warning'} />
                        </View>

                        {plan.features.map((f) => (
                            <View key={f} style={styles.featureRow}>
                                <Text style={[styles.featureCheck, { color: plan.color }]}>✓</Text>
                                <Text style={styles.featureText}>{f}</Text>
                            </View>
                        ))}

                        {selected === plan.id && (
                            <View style={[styles.selectedIndicator, { backgroundColor: plan.color }]} />
                        )}
                    </TouchableOpacity>
                ))}

                {/* Free tier comparison */}
                <View style={styles.freeNote}>
                    <Text style={styles.freeNoteText}>
                        💡 Paket Gratis: 10 like/hari, tidak bisa melihat yang suka kamu, iklan terbatas
                    </Text>
                </View>

                {/* CTA */}
                <CButton
                    label={`Mulai ${PLANS.find((p) => p.id === selected)?.name ?? ''}`}
                    onPress={() =>
                        Alert.alert('Segera Hadir', 'Pembayaran melalui Midtrans akan segera tersedia!', [
                            { text: 'OK' },
                        ])
                    }
                    style={styles.ctaBtn}
                    accessibilityHint="Berlangganan paket premium yang dipilih"
                />

                <Text style={styles.legalNote}>
                    Pembayaran diproses dengan aman melalui Midtrans. Dapat dibatalkan kapan saja.{'\n'}
                    Privasi kamu terlindungi — E2EE tetap aktif untuk semua pengguna.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scroll: { padding: Spacing.lg, gap: Spacing.md },
    hero: { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
    heroIcon: { fontSize: 56 },
    heroTitle: { fontFamily: FontFamily.displayFallback, fontSize: FontSize['2xl'], color: Colors.textPrimary, fontWeight: '700' },
    heroSubtitle: { fontFamily: FontFamily.body, fontSize: FontSize.md, color: Colors.textSecondary },
    planCard: {
        backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
        padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border,
        gap: Spacing.sm, position: 'relative', overflow: 'hidden',
    },
    planCardSelected: {
        borderWidth: 2,
    },
    planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
    planName: { fontFamily: FontFamily.displayFallback, fontSize: FontSize.xl, fontWeight: '700' },
    priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 2 },
    price: { fontFamily: FontFamily.bodyBold, fontSize: FontSize['2xl'], color: Colors.textPrimary },
    period: { fontFamily: FontFamily.body, fontSize: FontSize.sm, color: Colors.textSecondary },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    featureCheck: { fontSize: FontSize.md, fontFamily: FontFamily.bodyBold, width: 20 },
    featureText: { fontFamily: FontFamily.body, fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
    selectedIndicator: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
    freeNote: {
        backgroundColor: Colors.card, borderRadius: BorderRadius.md,
        padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
    },
    freeNoteText: { fontFamily: FontFamily.body, fontSize: FontSize.sm, color: Colors.textSecondary },
    ctaBtn: { marginTop: Spacing.md },
    legalNote: { fontFamily: FontFamily.body, fontSize: FontSize.xs, color: Colors.textDisabled, textAlign: 'center', lineHeight: 18 },
});
