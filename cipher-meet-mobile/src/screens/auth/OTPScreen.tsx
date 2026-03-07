import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, FontSize, FontFamily, Spacing, BorderRadius, MinTouchTarget } from '../../theme';
import { CButton } from '../../components/atoms/CButton/CButton';
import { AuthStackParams } from '../../navigation/RootNavigator';
import { useAuthStore } from '../../stores/authStore';

type Nav = StackNavigationProp<AuthStackParams, 'OTP'>;
type RouteT = RouteProp<AuthStackParams, 'OTP'>;

export const OTPScreen: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<RouteT>();
    const { phoneNumber } = route.params;
    const { setTokens, setUser } = useAuthStore();

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(59);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef<TextInput[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((c) => (c > 0 ? c - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleDigit = (value: string, index: number) => {
        const digit = value.replace(/[^0-9]/g, '').slice(-1);
        const next = [...otp];
        next[index] = digit;
        setOtp(next);
        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length < 6) {
            setError('Masukkan 6 digit kode OTP');
            return;
        }
        setError('');
        setLoading(true);
        try {
            // TODO: call API
            // Stub: simulate success
            setTokens('mock-access-token', 'mock-refresh-token');
            setUser({ id: '1', email: 'user@example.com', fullName: 'User' });
        } catch {
            setError('Kode OTP tidak valid atau sudah kadaluarsa');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <TouchableOpacity
                style={styles.back}
                onPress={() => navigation.goBack()}
                accessibilityRole="button"
                accessibilityLabel="Kembali"
            >
                <Text style={styles.backText}>← Kembali</Text>
            </TouchableOpacity>

            <Text style={styles.title} accessibilityRole="header">Verifikasi OTP</Text>
            <Text style={styles.subtitle}>
                Kode dikirim ke <Text style={styles.phone}>{phoneNumber}</Text>
            </Text>

            {/* 6-digit OTP boxes */}
            <View style={styles.otpRow} accessibilityLabel="Masukkan 6 digit kode OTP">
                {otp.map((digit, i) => (
                    <TextInput
                        key={i}
                        ref={(ref) => { if (ref) inputRefs.current[i] = ref; }}
                        style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                        value={digit}
                        onChangeText={(v) => handleDigit(v, i)}
                        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                        keyboardType="numeric"
                        maxLength={1}
                        textContentType="oneTimeCode"
                        accessibilityLabel={`Digit OTP ke-${i + 1}`}
                        selectTextOnFocus
                    />
                ))}
            </View>

            {error ? (
                <Text style={styles.error} accessibilityLiveRegion="assertive">⚠︎ {error}</Text>
            ) : null}

            {/* Countdown / resend */}
            <View style={styles.resendRow}>
                {countdown > 0 ? (
                    <Text style={styles.countdownText} accessibilityLiveRegion="polite">
                        Kirim ulang dalam 00:{String(countdown).padStart(2, '0')}
                    </Text>
                ) : (
                    <TouchableOpacity
                        onPress={() => setCountdown(59)}
                        accessibilityRole="button"
                        accessibilityLabel="Kirim ulang kode OTP"
                    >
                        <Text style={styles.resendText}>Kirim Ulang Kode</Text>
                    </TouchableOpacity>
                )}
            </View>

            <CButton
                label="Verifikasi"
                onPress={handleVerify}
                fullWidth
                disabled={otp.join('').length < 6}
                loading={loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.lg, paddingTop: 80 },
    back: { minHeight: MinTouchTarget, justifyContent: 'center', alignSelf: 'flex-start', marginBottom: Spacing.xl },
    backText: { color: Colors.primary, fontFamily: FontFamily.bodyMedium, fontSize: FontSize.md },
    title: { fontFamily: FontFamily.displayFallback, fontSize: FontSize['3xl'], color: Colors.textPrimary, fontWeight: '700', marginBottom: Spacing.sm },
    subtitle: { fontFamily: FontFamily.body, fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.xl },
    phone: { color: Colors.primary, fontFamily: FontFamily.bodyBold },
    otpRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
    otpBox: {
        flex: 1, height: 56, borderRadius: BorderRadius.sm,
        backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border,
        textAlign: 'center', fontSize: FontSize['2xl'],
        fontFamily: FontFamily.monoFallback, color: Colors.textPrimary,
    },
    otpBoxFilled: { borderColor: Colors.primary, backgroundColor: 'rgba(124,92,252,0.08)' },
    error: { color: Colors.error, fontFamily: FontFamily.body, fontSize: FontSize.sm, marginBottom: Spacing.md },
    resendRow: { alignItems: 'center', marginBottom: Spacing.xl },
    countdownText: { color: Colors.textSecondary, fontFamily: FontFamily.bodyMedium, fontSize: FontSize.md },
    resendText: { color: Colors.primary, fontFamily: FontFamily.bodyBold, fontSize: FontSize.md },
});
