import React, { useCallback, useRef } from 'react';
import {
    View, Text, StyleSheet, LayoutChangeEvent, PanResponder,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import { Colors, FontSize, FontFamily, Spacing } from '../../../theme';

interface CSliderProps {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onValueChange: (value: number) => void;
    label?: string;
    showValue?: boolean;
    accessibilityLabel?: string;
}

export const CSlider: React.FC<CSliderProps> = ({
    value, min = 0, max = 100, step = 1,
    onValueChange, label, showValue = true, accessibilityLabel,
}) => {
    const trackWidthRef = useRef(200);
    const translateX = useSharedValue(((value - min) / (max - min)) * 200);

    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(v, hi));

    const toX = (val: number) => ((val - min) / (max - min)) * trackWidthRef.current;
    const toVal = (x: number) => min + (x / trackWidthRef.current) * (max - min);

    const onLayout = useCallback((e: LayoutChangeEvent) => {
        trackWidthRef.current = e.nativeEvent.layout.width - 24;
        translateX.value = toX(value);
    }, [value, min, max]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (_e, gs) => {
                translateX.value = clamp(gs.x0 - 12, 0, trackWidthRef.current);
            },
            onPanResponderMove: (_e, gs) => {
                const rawX = clamp(gs.moveX - 12, 0, trackWidthRef.current);
                translateX.value = rawX;
                const rawVal = toVal(rawX);
                const stepped = Math.round(rawVal / step) * step;
                runOnJS(onValueChange)(clamp(stepped, min, max));
            },
        }),
    ).current;

    const thumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const fillStyle = useAnimatedStyle(() => ({
        width: translateX.value + 12,
    }));

    return (
        <View style={styles.container}>
            {(label || showValue) && (
                <View style={styles.labelRow}>
                    {label && <Text style={styles.label}>{label}</Text>}
                    {showValue && <Text style={styles.valueText}>{value}</Text>}
                </View>
            )}
            <View
                style={styles.trackWrapper}
                onLayout={onLayout}
                accessible
                accessibilityRole="adjustable"
                accessibilityLabel={accessibilityLabel ?? label ?? 'Slider'}
                accessibilityValue={{ min, max, now: value, text: `${value}` }}
                {...panResponder.panHandlers}
            >
                <View style={styles.track}>
                    <Animated.View style={[styles.fill, fillStyle]} />
                </View>
                <Animated.View style={[styles.thumb, thumbStyle]} />
            </View>
            <View style={styles.minMaxRow}>
                <Text style={styles.minMax}>{min}</Text>
                <Text style={styles.minMax}>{max}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%' },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
    label: { fontFamily: FontFamily.bodyMedium, fontSize: FontSize.md, color: Colors.textPrimary },
    valueText: { fontFamily: FontFamily.bodyBold, fontSize: FontSize.md, color: Colors.primary },
    trackWrapper: { height: 40, justifyContent: 'center', position: 'relative' },
    track: { height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden' },
    fill: { height: 6, backgroundColor: Colors.primary, borderRadius: 3, position: 'absolute', left: 0, top: 0 },
    thumb: {
        position: 'absolute', top: 7, left: 0, width: 24, height: 24,
        borderRadius: 12, backgroundColor: Colors.primary,
        shadowColor: Colors.primary, shadowOpacity: 0.5, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    minMaxRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
    minMax: { fontFamily: FontFamily.body, fontSize: FontSize.xs, color: Colors.textSecondary },
});
