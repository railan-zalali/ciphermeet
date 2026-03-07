import React from 'react';
import {
    TouchableOpacity, Text, ActivityIndicator, ViewStyle,
    TextStyle, StyleSheet,
} from 'react-native';
import { Colors, FontSize, FontFamily, Spacing, BorderRadius, Shadow, MinTouchTarget } from '../../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface CButtonProps {
    label: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    style?: ViewStyle;
}

export const CButton: React.FC<CButtonProps> = ({
    label,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    accessibilityLabel,
    accessibilityHint,
    style,
}) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? label}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled: isDisabled }}
            style={[
                styles.base,
                sizeStyles[size],
                variantStyles[variant],
                fullWidth && styles.fullWidth,
                isDisabled && styles.disabled,
                style,
            ]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'ghost' ? Colors.primary : Colors.textPrimary}
                    size="small"
                    accessibilityLabel="Memuat..."
                />
            ) : (
                <Text
                    style={[
                        styles.label,
                        sizeLabelStyles[size],
                        variantLabelStyles[variant],
                        isDisabled && styles.labelDisabled,
                    ]}
                    numberOfLines={1}
                >
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        minHeight: MinTouchTarget,
        minWidth: MinTouchTarget,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
        ...Shadow.button,
    },
    fullWidth: { width: '100%' },
    disabled: { opacity: 0.4, ...{ shadowOpacity: 0 }, elevation: 0 },
    label: {
        fontFamily: FontFamily.bodySemiBold,
        letterSpacing: 0.3,
    },
    labelDisabled: { opacity: 0.7 },
});

const sizeStyles: Record<ButtonSize, ViewStyle> = {
    sm: { minHeight: 40, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.sm },
    md: { minHeight: MinTouchTarget, paddingHorizontal: Spacing.lg },
    lg: { minHeight: 56, paddingHorizontal: Spacing.xl },
};

const sizeLabelStyles: Record<ButtonSize, TextStyle> = {
    sm: { fontSize: FontSize.sm },
    md: { fontSize: FontSize.md },
    lg: { fontSize: FontSize.lg },
};

const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: { backgroundColor: Colors.primary },
    secondary: { backgroundColor: Colors.secondary },
    ghost: {
        backgroundColor: Colors.transparent,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        shadowOpacity: 0,
        elevation: 0,
    },
    danger: { backgroundColor: Colors.error },
};

const variantLabelStyles: Record<ButtonVariant, TextStyle> = {
    primary: { color: Colors.textPrimary },
    secondary: { color: Colors.textPrimary },
    ghost: { color: Colors.primary },
    danger: { color: Colors.textPrimary },
};
