import React, { useState, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, TextInputProps, Animated,
} from 'react-native';
import { Colors, FontSize, FontFamily, Spacing, BorderRadius, MinTouchTarget } from '../../theme';

interface CInputProps extends TextInputProps {
    label: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    trailingIcon?: React.ReactNode;
    onTrailingIconPress?: () => void;
    trailingIconAccessibilityLabel?: string;
}

export const CInput: React.FC<CInputProps> = ({
    label,
    error,
    helperText,
    required = false,
    trailingIcon,
    onTrailingIconPress,
    trailingIconAccessibilityLabel,
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
        rest.onFocus?.(null as any);
    };

    const handleBlur = () => {
        setIsFocused(false);
        Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
        rest.onBlur?.(null as any);
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [error ? Colors.error : Colors.border, error ? Colors.error : Colors.primary],
    });

    const inputId = `input-${label.toLowerCase().replace(/\s/g, '-')}`;

    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <Text style={styles.label} nativeID={`${inputId}-label`}>
                    {label}
                    {required && (
                        <Text style={styles.required} accessibilityLabel=" wajib diisi">
                            {' *'}
                        </Text>
                    )}
                </Text>
            </View>
            <Animated.View style={[styles.inputWrapper, { borderColor }]}>
                <TextInput
                    {...rest}
                    style={[styles.input, trailingIcon ? styles.inputWithTrailing : null]}
                    placeholderTextColor={Colors.textDisabled}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    accessibilityLabel={label + (required ? ', wajib diisi' : '')}
                    accessibilityHint={rest.accessibilityHint ?? helperText}
                    accessibilityLabelledBy={`${inputId}-label`}
                    accessibilityState={{ disabled: rest.editable === false }}
                    accessible
                />
                {trailingIcon && (
                    <TouchableOpacity
                        onPress={onTrailingIconPress}
                        style={styles.trailingIcon}
                        accessibilityLabel={trailingIconAccessibilityLabel}
                        accessibilityRole="button"
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        {trailingIcon}
                    </TouchableOpacity>
                )}
            </Animated.View>
            {error ? (
                <Text
                    style={styles.error}
                    accessibilityLiveRegion="polite"
                    accessibilityRole="text"
                >
                    ⚠︎ {error}
                </Text>
            ) : helperText ? (
                <Text style={styles.helper}>{helperText}</Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: Spacing.md },
    labelRow: { flexDirection: 'row', marginBottom: Spacing.xs },
    label: {
        fontFamily: FontFamily.bodyMedium,
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    required: { color: Colors.error, fontFamily: FontFamily.bodyBold },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderWidth: 1.5,
        borderRadius: BorderRadius.sm,
        minHeight: MinTouchTarget,
    },
    input: {
        flex: 1,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        fontFamily: FontFamily.body,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
        minHeight: MinTouchTarget,
    },
    inputWithTrailing: { paddingRight: 0 },
    trailingIcon: {
        paddingHorizontal: Spacing.md,
        height: MinTouchTarget,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: MinTouchTarget,
    },
    error: {
        color: Colors.error,
        fontSize: FontSize.xs,
        fontFamily: FontFamily.body,
        marginTop: 4,
        marginLeft: 2,
    },
    helper: {
        color: Colors.textSecondary,
        fontSize: FontSize.xs,
        fontFamily: FontFamily.body,
        marginTop: 4,
        marginLeft: 2,
    },
});
