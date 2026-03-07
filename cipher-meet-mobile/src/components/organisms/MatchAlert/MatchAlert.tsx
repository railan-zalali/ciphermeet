import React, { useEffect, useRef } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Modal,
    Animated, Easing, SafeAreaView,
} from 'react-native';
import { Colors, FontSize, FontFamily, Spacing, BorderRadius, MinTouchTarget } from '../../../theme';
import { CAvatar } from '../../atoms/CAvatar/CAvatar';
import { CButton } from '../../atoms/CButton/CButton';

interface MatchAlertProps {
    visible: boolean;
    myName: string;
    partnerName: string;
    partnerPhoto?: string;
    onStartChat: () => void;
    onDismiss: () => void;
}

export const MatchAlert: React.FC<MatchAlertProps> = ({
    visible, myName, partnerName, partnerPhoto, onStartChat, onDismiss,
}) => {
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.spring(scale, {
                    toValue: 1, tension: 50, friction: 7, useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
                Animated.timing(scale, { toValue: 0.8, duration: 200, useNativeDriver: true, easing: Easing.in(Easing.ease) }),
            ]).start();
        }
    }, [visible]);

    return (
        <Modal
            transparent
            visible={visible}
            statusBarTranslucent
            onRequestClose={onDismiss}
            accessibilityViewIsModal
        >
            <Animated.View style={[styles.backdrop, { opacity }]} />

            <SafeAreaView style={styles.centered}>
                <Animated.View
                    style={[styles.card, { transform: [{ scale }], opacity }]}
                    accessible
                    accessibilityRole="alert"
                    accessibilityLabel={`Selamat! Kamu dan ${partnerName} saling suka. Ini adalah match baru.`}
                >
                    {/* Confetti emojis */}
                    <Text style={styles.confetti}>🎊</Text>
                    <Text style={styles.headline}>Selamat! 💫</Text>
                    <Text style={styles.matchText}>Kamu dan {partnerName} saling suka!</Text>

                    {/* Avatars */}
                    <View style={styles.avatarRow}>
                        <View style={styles.avatarWrapper}>
                            <CAvatar name={myName} size="xl" accessibilityLabel="Foto profilmu" />
                            <Text style={styles.avatarLabel}>Kamu</Text>
                        </View>
                        <Text style={styles.heartDivider}>❤️</Text>
                        <View style={styles.avatarWrapper}>
                            <CAvatar name={partnerName} photoUrl={partnerPhoto} size="xl" accessibilityLabel={`Foto ${partnerName}`} />
                            <Text style={styles.avatarLabel}>{partnerName}</Text>
                        </View>
                    </View>

                    {/* E2EE note */}
                    <View style={styles.e2eeBadge}>
                        <Text style={styles.e2eeText}>🔐 Chat kalian terenkripsi E2EE dengan Signal Protocol</Text>
                    </View>

                    {/* CTAs */}
                    <CButton
                        label="💬 Mulai Chat"
                        onPress={onStartChat}
                        style={styles.ctaBtn}
                        accessibilityHint="Buka ruang chat dengan match baru"
                    />
                    <TouchableOpacity
                        onPress={onDismiss}
                        style={styles.dismissBtn}
                        accessibilityRole="button"
                        accessibilityLabel="Tutup notifikasi match, lanjut mencari"
                    >
                        <Text style={styles.dismissText}>Terus mencari →</Text>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.75)' },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    card: {
        backgroundColor: Colors.card, borderRadius: BorderRadius.xl,
        padding: Spacing.xl, margin: Spacing.lg, alignItems: 'center', gap: Spacing.md,
        shadowColor: Colors.primary, shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
        elevation: 16,
    },
    confetti: { fontSize: 48 },
    headline: { fontFamily: FontFamily.displayFallback, fontSize: FontSize['2xl'], color: Colors.textPrimary, fontWeight: '700' },
    matchText: { fontFamily: FontFamily.body, fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center' },
    avatarRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, marginVertical: Spacing.md },
    avatarWrapper: { alignItems: 'center', gap: Spacing.sm },
    avatarLabel: { fontFamily: FontFamily.bodyMedium, fontSize: FontSize.sm, color: Colors.textPrimary },
    heartDivider: { fontSize: 32 },
    e2eeBadge: {
        backgroundColor: 'rgba(124,92,252,0.1)', borderRadius: BorderRadius.sm,
        padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border,
    },
    e2eeText: { fontFamily: FontFamily.body, fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center' },
    ctaBtn: { width: '100%' },
    dismissBtn: { minHeight: MinTouchTarget, justifyContent: 'center', paddingHorizontal: Spacing.md },
    dismissText: { color: Colors.textSecondary, fontFamily: FontFamily.bodyMedium, fontSize: FontSize.md },
});
