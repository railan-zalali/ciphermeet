import React, { useState, useRef } from 'react';
import {
    View, Text, FlatList, Animated, TouchableOpacity,
    StyleSheet, Dimensions, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, FontSize, FontFamily, Spacing, BorderRadius, MinTouchTarget } from '../../theme';
import { CButton } from '../../components/atoms/CButton/CButton';
import { AuthStackParams } from '../../navigation/RootNavigator';

type Nav = StackNavigationProp<AuthStackParams, 'Onboarding'>;

const { width: SCREEN_W } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        emoji: '💑',
        title: 'Temukan Koneksi Nyata',
        body: 'Temukan seseorang yang benar-benar cocok denganmu — berdasarkan minat, kepribadian, dan kedekatan.',
        a11yLabel: 'Slide 1 dari 3: Temukan Koneksi Nyata',
    },
    {
        id: '2',
        emoji: '🔐',
        title: 'Privasi Tanpa Kompromi',
        body: 'Pesanmu dienkripsi end-to-end dengan Signal Protocol. Bahkan kami tidak bisa membacanya.',
        a11yLabel: 'Slide 2 dari 3: Privasi Tanpa Kompromi',
    },
    {
        id: '3',
        emoji: '✨',
        title: 'Mulai Perjalananmu',
        body: 'Bergabung dengan jutaan pengguna yang menemukan cinta sejati tanpa mengorbankan privasi mereka.',
        a11yLabel: 'Slide 3 dari 3: Mulai Perjalananmu',
    },
];

export const OnboardingScreen: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const goNext = () => {
        if (activeIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

            {/* Skip */}
            <TouchableOpacity
                style={styles.skipButton}
                onPress={() => navigation.navigate('Login')}
                accessibilityRole="button"
                accessibilityLabel="Lewati onboarding"
            >
                <Text style={styles.skipText}>Lewati</Text>
            </TouchableOpacity>

            {/* Slides */}
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={(e) => {
                    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
                    setActiveIndex(idx);
                }}
                renderItem={({ item }) => (
                    <View
                        style={styles.slide}
                        accessible
                        accessibilityLabel={item.a11yLabel}
                    >
                        <Text style={styles.emoji}>{item.emoji}</Text>
                        <Text style={styles.title} accessibilityRole="header">{item.title}</Text>
                        <Text style={styles.body}>{item.body}</Text>
                    </View>
                )}
            />

            {/* Dot indicators */}
            <View style={styles.dots} accessibilityLabel={`Slide ${activeIndex + 1} dari ${SLIDES.length}`}>
                {SLIDES.map((_, i) => (
                    <View
                        key={i}
                        style={[styles.dot, i === activeIndex && styles.activeDot]}
                        accessible={false}
                    />
                ))}
            </View>

            {/* CTA */}
            <View style={styles.cta}>
                {activeIndex < SLIDES.length - 1 ? (
                    <CButton
                        label="Lanjut →"
                        onPress={goNext}
                        fullWidth
                    />
                ) : (
                    <>
                        <CButton
                            label="Daftar Sekarang"
                            onPress={() => navigation.navigate('Register')}
                            fullWidth
                        />
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            style={styles.loginLink}
                            accessibilityRole="link"
                            accessibilityLabel="Sudah punya akun? Masuk"
                        >
                            <Text style={styles.loginLinkText}>Sudah punya akun? <Text style={styles.loginLinkBold}>Masuk</Text></Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    skipButton: {
        position: 'absolute', top: 56, right: Spacing.lg, zIndex: 10,
        minHeight: MinTouchTarget, justifyContent: 'center',
        paddingHorizontal: Spacing.md,
    },
    skipText: { color: Colors.textSecondary, fontFamily: FontFamily.bodyMedium, fontSize: FontSize.md },
    slide: {
        width: SCREEN_W, flex: 1,
        alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: Spacing.xl, gap: Spacing.lg,
    },
    emoji: { fontSize: 80, marginBottom: Spacing.md },
    title: {
        fontFamily: FontFamily.displayFallback,
        fontSize: FontSize['3xl'],
        color: Colors.textPrimary,
        textAlign: 'center',
        fontWeight: '700',
    },
    body: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.lg,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: FontSize.lg * 1.6,
    },
    dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: Spacing.lg },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
    activeDot: { width: 24, backgroundColor: Colors.primary },
    cta: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing['2xl'], gap: Spacing.md },
    loginLink: { alignItems: 'center', minHeight: MinTouchTarget, justifyContent: 'center' },
    loginLinkText: { color: Colors.textSecondary, fontFamily: FontFamily.body, fontSize: FontSize.md },
    loginLinkBold: { color: Colors.primary, fontFamily: FontFamily.bodyBold },
});
