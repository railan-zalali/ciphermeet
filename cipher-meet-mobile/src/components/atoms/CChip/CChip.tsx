import React from 'react';
import {
    TouchableOpacity, Text, StyleSheet, ViewStyle,
} from 'react-native';
import { Colors, FontSize, FontFamily, Spacing, BorderRadius } from '../../../theme';

export type ChipVariant = 'outlined' | 'filled' | 'selected';

interface CChipProps {
    label: string;
    emoji?: string;
    selected?: boolean;
    onPress?: () => void;
    variant?: ChipVariant;
    accessibilityLabel?: string;
    style?: ViewStyle;
}

export const CChip: React.FC<CChipProps> = ({
    label, emoji, selected = false, onPress, variant = 'outlined',
    accessibilityLabel, style,
}) => {
    const activeVariant: ChipVariant = selected ? 'selected' : variant;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.base, variantStyles[activeVariant], style]}
            accessibilityRole={onPress ? 'button' : 'text'}
            accessibilityLabel={accessibilityLabel ?? (emoji ? `${emoji} ${label}` : label)}
            accessibilityState={{ selected }}
            activeOpacity={0.75}
        >
            {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
            <Text style={[styles.label, variantLabelStyles[activeVariant]]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.md,
        paddingVertical: 7,
        minHeight: 36,
        borderWidth: 1.5,
        marginRight: Spacing.xs,
        marginBottom: Spacing.xs,
    },
    emoji: { fontSize: FontSize.md, marginRight: 4 },
    label: {
        fontFamily: FontFamily.bodyMedium,
        fontSize: FontSize.sm,
    },
});

const variantStyles: Record<ChipVariant, ViewStyle> = {
    outlined: { borderColor: Colors.border, backgroundColor: Colors.transparent },
    filled: { borderColor: Colors.card, backgroundColor: Colors.card },
    selected: { borderColor: Colors.primary, backgroundColor: 'rgba(124,92,252,0.15)' },
};

const variantLabelStyles: Record<ChipVariant, { color: string }> = {
    outlined: { color: Colors.textSecondary },
    filled: { color: Colors.textPrimary },
    selected: { color: Colors.primary },
};
