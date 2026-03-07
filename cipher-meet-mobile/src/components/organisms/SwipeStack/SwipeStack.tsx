import React, { useCallback } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Dimensions,
    AccessibilityInfo,
} from 'react-native';
import Animated, {
    useSharedValue, useAnimatedStyle, withSpring, runOnJS,
    interpolate, Extrapolation,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Colors, Spacing, BorderRadius, FontSize, FontFamily, MinTouchTarget } from '../../theme';
import { ProfileCard, ProfileCardData } from '../molecules/ProfileCard/ProfileCard';

const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_W * 0.35;
const ROTATION_MULTIPLIER = 0.07;

type SwipeDirection = 'like' | 'pass' | 'super';

interface SwipeStackProps {
    profiles: ProfileCardData[];
    onSwipe: (profileId: string, direction: SwipeDirection) => void;
    onCardPress?: (profile: ProfileCardData) => void;
}

export const SwipeStack: React.FC<SwipeStackProps> = ({
    profiles, onSwipe, onCardPress,
}) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const currentProfile = profiles[0];
    const nextProfile = profiles[1];
    const thirdProfile = profiles[2];

    const handleSwipe = useCallback(
        (direction: SwipeDirection, profileId: string) => {
            onSwipe(profileId, direction);
        },
        [onSwipe],
    );

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = e.translationX;
            translateY.value = e.translationY;
        })
        .onEnd((e) => {
            const isLike = e.translationX > SWIPE_THRESHOLD;
            const isPass = e.translationX < -SWIPE_THRESHOLD;
            const isSuper = e.translationY < -SWIPE_THRESHOLD;

            if (isSuper && currentProfile) {
                translateY.value = withSpring(-600, { damping: 20 });
                runOnJS(handleSwipe)('super', currentProfile.id);
            } else if (isLike && currentProfile) {
                translateX.value = withSpring(SCREEN_W * 1.5, { damping: 20 });
                runOnJS(handleSwipe)('like', currentProfile.id);
            } else if (isPass && currentProfile) {
                translateX.value = withSpring(-SCREEN_W * 1.5, { damping: 20 });
                runOnJS(handleSwipe)('pass', currentProfile.id);
            } else {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const animatedCardStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            translateX.value,
            [-SCREEN_W, 0, SCREEN_W],
            [-15, 0, 15],
            Extrapolation.CLAMP,
        );
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: `${rotate * ROTATION_MULTIPLIER * 10}deg` },
            ],
        };
    });

    // Overlay animations
    const likeOverlayStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
    }));
    const passOverlayStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP),
    }));
    const superOverlayStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateY.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP),
    }));

    if (!currentProfile) {
        return (
            <View style={styles.empty}>
                <Text style={styles.emptyText}>🎉 Kamu sudah melihat semua profil di sekitarmu!</Text>
                <Text style={styles.emptySubtext}>Coba besok lagi atau perluas area pencarianmu.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Third card (bottom) */}
            {thirdProfile && (
                <View style={[styles.cardWrapper, styles.thirdCard]} pointerEvents="none">
                    <ProfileCard profile={thirdProfile} />
                </View>
            )}

            {/* Second card */}
            {nextProfile && (
                <View style={[styles.cardWrapper, styles.secondCard]} pointerEvents="none">
                    <ProfileCard profile={nextProfile} />
                </View>
            )}

            {/* Top card — swipeable */}
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.cardWrapper, animatedCardStyle]}>
                    <ProfileCard
                        profile={currentProfile}
                        onPress={() => onCardPress?.(currentProfile)}
                    />
                    {/* Swipe overlays */}
                    <Animated.View style={[styles.overlay, styles.likeOverlay, likeOverlayStyle]}>
                        <Text style={styles.overlayText}>SUKA 💚</Text>
                    </Animated.View>
                    <Animated.View style={[styles.overlay, styles.passOverlay, passOverlayStyle]}>
                        <Text style={styles.overlayText}>LEWAT ✕</Text>
                    </Animated.View>
                    <Animated.View style={[styles.overlay, styles.superOverlay, superOverlayStyle]}>
                        <Text style={styles.overlayText}>SUPER ⭐</Text>
                    </Animated.View>
                </Animated.View>
            </GestureDetector>

            {/* Accessibility action buttons (WCAG 2.5 — alternative to gesture) */}
            <View
                style={styles.actionButtons}
                accessibilityLabel="Tombol aksi swipe"
            >
                <TouchableOpacity
                    style={[styles.actionBtn, styles.passBtn]}
                    onPress={() => handleSwipe('pass', currentProfile.id)}
                    accessibilityRole="button"
                    accessibilityLabel="Lewat — tidak tertarik dengan profil ini"
                    accessibilityHint="Setara dengan swipe ke kiri"
                >
                    <Text style={styles.actionBtnText}>✕</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.superBtn]}
                    onPress={() => handleSwipe('super', currentProfile.id)}
                    accessibilityRole="button"
                    accessibilityLabel="Super Like profil ini"
                    accessibilityHint="Setara dengan swipe ke atas"
                >
                    <Text style={styles.actionBtnText}>⭐</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.likeBtn]}
                    onPress={() => handleSwipe('like', currentProfile.id)}
                    accessibilityRole="button"
                    accessibilityLabel="Suka profil ini"
                    accessibilityHint="Setara dengan swipe ke kanan"
                >
                    <Text style={styles.actionBtnText}>♥</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center' },
    cardWrapper: {
        position: 'absolute',
        width: SCREEN_W - Spacing.lg * 2,
        top: 0,
    },
    secondCard: { transform: [{ scale: 0.97 }], top: 8 },
    thirdCard: { transform: [{ scale: 0.94 }], top: 16 },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    likeOverlay: { backgroundColor: 'rgba(34,211,165,0.4)' },
    passOverlay: { backgroundColor: 'rgba(255,77,109,0.4)' },
    superOverlay: { backgroundColor: 'rgba(124,92,252,0.4)' },
    overlayText: {
        color: Colors.textPrimary,
        fontSize: FontSize['2xl'],
        fontFamily: FontFamily.bodyBold,
        letterSpacing: 2,
    },
    actionButtons: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        gap: Spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionBtn: {
        width: 60,
        height: 60,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        minWidth: MinTouchTarget,
        minHeight: MinTouchTarget,
    },
    passBtn: { backgroundColor: Colors.error, width: 56, height: 56 },
    superBtn: { backgroundColor: Colors.primary },
    likeBtn: { backgroundColor: Colors.success, width: 56, height: 56 },
    actionBtnText: { fontSize: 22, color: Colors.textPrimary },
    empty: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
    },
    emptyText: {
        fontFamily: FontFamily.bodyBold,
        fontSize: FontSize.xl,
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    emptySubtext: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
});
