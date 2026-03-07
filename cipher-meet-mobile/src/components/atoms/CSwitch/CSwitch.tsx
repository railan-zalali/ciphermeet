import React from 'react';
import {
    Switch, View, Text, StyleSheet,
} from 'react-native';
import { Colors, FontSize, FontFamily, Spacing, MinTouchTarget } from '../../../theme';

interface CSwitchProps {
    value: boolean;
    onChange: (val: boolean) => void;
    label: string;
    description?: string;
    disabled?: boolean;
    accessibilityLabel?: string;
}

export const CSwitch: React.FC<CSwitchProps> = ({
    value, onChange, label, description, disabled = false, accessibilityLabel,
}) => {
    return (
        <View
            style={styles.row}
            accessible
            accessibilityRole="switch"
            accessibilityLabel={accessibilityLabel || (label + (description ? `. ${description}` : ''))}
            accessibilityState={{ checked: value, disabled }}
        >
            <View style={styles.textContainer}>
                <Text style={styles.label}>{label}</Text>
                {description ? <Text style={styles.description}>{description}</Text> : null}
            </View>
            <Switch
                value={value}
                onValueChange={onChange}
                disabled={disabled}
                trackColor={{ false: Colors.border, true: Colors.primaryAlpha35 }}
                thumbColor={value ? Colors.primary : Colors.textDisabled}
                accessible={false} // Parent View handles a11y
                style={styles.switch}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: MinTouchTarget,
        paddingVertical: Spacing.sm,
    },
    textContainer: { flex: 1, marginRight: Spacing.md },
    label: {
        fontFamily: FontFamily.bodyMedium,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },
    description: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    switch: { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] },
});
