import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, StatusBar,
    KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, FontSize, FontFamily, Spacing, MinTouchTarget } from '../../theme';
import { CButton } from '../../components/atoms/CButton/CButton';
import { CInput } from '../../components/atoms/CInput/CInput';
import { AuthStackParams } from '../../navigation/RootNavigator';
import { useAuthStore } from '../../stores/authStore';

type Nav = StackNavigationProp<AuthStackParams, 'Login'>;

export const LoginScreen: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const { setTokens, setUser } = useAuthStore();
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!emailOrPhone || !password) {
            setError('Email/HP dan password wajib diisi');
            return;
        }
        setError('');
        setLoading(true);
        try {
            // TODO: call API
            setTokens('mock-access-token', 'mock-refresh-token');
            setUser({ id: '1', email: emailOrPhone, fullName: 'User' });
        } catch {
            setError('Email atau password salah');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <View style={styles.container}>
                <Text style={styles.title} accessibilityRole="header">Masuk</Text>
                <Text style={styles.subtitle}>Selamat datang kembali 👋</Text>

                {error ? (
                    <View style={styles.errorBanner} accessibilityLiveRegion="assertive">
                        <Text style={styles.errorText}>⚠︎ {error}</Text>
                    </View>
                ) : null}

                <CInput
                    label="Email atau Nomor HP" required
                    value={emailOrPhone}
                    onChangeText={setEmailOrPhone}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                />
                <CInput
                    label="Password" required
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    trailingIcon={<Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁'}</Text>}
                    onTrailingIconPress={() => setShowPassword(!showPassword)}
                    trailingIconAccessibilityLabel={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    autoComplete="current-password"
                />

                <TouchableOpacity
                    style={styles.forgotLink}
                    accessibilityRole="link"
                    accessibilityLabel="Lupa password"
                >
                    <Text style={styles.forgotText}>Lupa Password?</Text>
                </TouchableOpacity>

                <CButton
                    label="Masuk"
                    onPress={handleLogin}
                    fullWidth
                    loading={loading}
                    style={{ marginTop: Spacing.lg }}
                />

                {/* Biometric placeholder */}
                <TouchableOpacity
                    style={styles.biometricBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Masuk dengan sidik jari"
                >
                    <Text style={styles.biometricIcon}>👆</Text>
                    <Text style={styles.biometricText}>Masuk dengan Biometrik</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                    style={styles.registerLink}
                    accessibilityRole="link"
                >
                    <Text style={styles.registerText}>Belum punya akun? <Text style={styles.link}>Daftar</Text></Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: Colors.background },
    container: { flex: 1, padding: Spacing.lg, paddingTop: 100, justifyContent: 'center' },
    title: { fontFamily: FontFamily.displayFallback, fontSize: FontSize['3xl'], color: Colors.textPrimary, fontWeight: '700', marginBottom: Spacing.sm },
    subtitle: { fontFamily: FontFamily.body, fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.xl },
    errorBanner: { backgroundColor: 'rgba(255,77,109,0.1)', borderRadius: 8, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.error },
    errorText: { color: Colors.error, fontFamily: FontFamily.bodyMedium, fontSize: FontSize.sm },
    forgotLink: { alignSelf: 'flex-end', minHeight: MinTouchTarget, justifyContent: 'center', marginTop: -Spacing.sm },
    forgotText: { color: Colors.primary, fontFamily: FontFamily.bodyMedium, fontSize: FontSize.sm },
    biometricBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, minHeight: MinTouchTarget, marginTop: Spacing.lg },
    biometricIcon: { fontSize: 24 },
    biometricText: { color: Colors.textSecondary, fontFamily: FontFamily.bodyMedium, fontSize: FontSize.md },
    registerLink: { alignItems: 'center', marginTop: Spacing.xl, minHeight: MinTouchTarget, justifyContent: 'center' },
    registerText: { color: Colors.textSecondary, fontFamily: FontFamily.body, fontSize: FontSize.md },
    link: { color: Colors.primary, fontFamily: FontFamily.bodyBold },
});
