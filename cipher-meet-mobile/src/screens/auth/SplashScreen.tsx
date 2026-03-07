import React, { useEffect, useRef } from 'react';
import {
    View, Text, Animated, StyleSheet, StatusBar,
    AccessibilityInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, FontSize, FontFamily } from '../../theme';
import { AuthStackParams } from '../../navigation/RootNavigator';

type Nav = StackNavigationProp<AuthStackParams, 'Splash'>;

export const SplashScreen: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const logoScale = useRef(new Animated.Value(0.7)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const taglineOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animate logo in
        Animated.sequence([
            Animated.parallel([
                Animated.spring(logoScale, { toValue: 1, friction: 6, useNativeDriver: true }),
                Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
            ]),
            Animated.delay(400),
            Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.delay(1000),
        ]).start(() => {
            navigation.replace('Onboarding');
        });
    }, []);

    return (
        <View style={styles.container} accessible accessibilityLabel="CipherMeet — memuat aplikasi">
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

            {/* Logo */}
            <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
                <View style={styles.logoCircle}>
                    <Text style={styles.logoEmoji}>🔐</Text>
                </View>
                <Text style={styles.appName}>CipherMeet</Text>
            </Animated.View>

            {/* Tagline */}
            <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
                Connect Securely, Match Meaningfully
            </Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
    },
    logoContainer: { alignItems: 'center', gap: 16 },
    logoCircle: {
        width: 96, height: 96,
        borderRadius: 28,
        backgroundColor: Colors.card,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, borderColor: Colors.primary,
        shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6, shadowRadius: 20, elevation: 12,
    },
    logoEmoji: { fontSize: 48 },
    appName: {
        fontFamily: FontFamily.displayFallback,
        fontSize: FontSize['4xl'],
        color: Colors.textPrimary,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    tagline: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        textAlign: 'center',
        letterSpacing: 0.3,
    },
});
