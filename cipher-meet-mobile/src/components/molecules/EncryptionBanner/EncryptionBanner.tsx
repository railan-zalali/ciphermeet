import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Colors, FontSize, FontFamily, Spacing } from '../../../theme';

interface EncryptionBannerProps {
    partnerName: string;
    onInfoPress?: () => void;
}

export const EncryptionBanner: React.FC<EncryptionBannerProps> = ({
    partnerName, onInfoPress,
}) => {
    const [dismissed, setDismissed] = useState(false);
    if (dismissed) return null;

    return (
        <View
            style={styles.banner}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`Pesan dengan ${partnerName} dilindungi enkripsi end-to-end Signal Protocol. Hanya kamu dan ${partnerName} yang dapat membacanya.`}
            accessibilityLiveRegion="polite"
        >
            <Text style={styles.icon} accessible={false}>🔐</Text>
            <Text style={styles.text} numberOfLines={2}>
                Pesan dilindungi <Text style={styles.bold}>Signal Protocol E2EE</Text>. Hanya kamu & {partnerName}.
            </Text>
            <TouchableOpacity
                onPress={onInfoPress}
                style={styles.infoButton}
                accessibilityLabel="Info enkripsi end-to-end"
                accessibilityRole="button"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Text style={styles.infoText}>Info</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setDismissed(true)}
                style={styles.closeButton}
                accessibilityLabel="Tutup notifikasi enkripsi"
                accessibilityRole="button"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(34,211,165,0.1)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(34,211,165,0.2)',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        gap: Spacing.sm,
    },
    icon: { fontSize: 14 },
    text: {
        flex: 1,
        fontFamily: FontFamily.body,
        fontSize: FontSize.xs,
        color: Colors.success,
    },
    bold: { fontFamily: FontFamily.bodyBold },
    infoButton: { paddingHorizontal: Spacing.sm },
    infoText: {
        fontFamily: FontFamily.bodyMedium,
        fontSize: FontSize.xs,
        color: Colors.primary,
    },
    closeButton: { paddingLeft: Spacing.sm },
    closeText: { fontSize: FontSize.xs, color: Colors.textSecondary },
});
