import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSize, FontFamily, BorderRadius, Spacing } from '../../../theme';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
type BadgeSize = 'sm' | 'md';

interface CBadgeProps {
    label: string | number;
    variant?: BadgeVariant;
    size?: BadgeSize;
    style?: ViewStyle;
    accessibilityLabel?: string;
}

const VARIANT_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
    primary: { bg: Colors.primary, text: Colors.white },
    success: { bg: Colors.success, text: '#0D1B2A' },
    warning: { bg: Colors.warning, text: '#0D1B2A' },
    danger: { bg: Colors.error, text: Colors.white },
    neutral: { bg: Colors.border, text: Colors.textSecondary },
};

export const CBadge: React.FC<CBadgeProps> = ({
    label, variant = 'primary', size = 'md', style, accessibilityLabel,
}) => {
    const { bg, text } = VARIANT_COLORS[variant];
    const isSmall = size === 'sm';

    return (
        <View
            style={[styles.badge, { backgroundColor: bg, paddingHorizontal: isSmall ? Spacing.sm : Spacing.md, paddingVertical: isSmall ? 2 : 4 }, style]}
            accessibilityLabel={accessibilityLabel ?? `${label}`}
            accessible
        >
            <Text style={[styles.text, { color: text, fontSize: isSmall ? FontSize.xs : FontSize.sm }]}>
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: { borderRadius: BorderRadius.full, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center' },
    text: { fontFamily: FontFamily.bodyBold, lineHeight: 18 },
});
