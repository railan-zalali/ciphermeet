import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, FontSize, FontFamily, Spacing, MinTouchTarget } from '../../theme';
import { CButton } from '../../components/atoms/CButton/CButton';
import { CInput } from '../../components/atoms/CInput/CInput';
import { AuthStackParams } from '../../navigation/RootNavigator';

type Nav = StackNavigationProp<AuthStackParams, 'Register'>;

const getPasswordStrength = (pwd: string): { score: number; label: string } => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const labels = ['Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
    return { score, label: labels[score - 1] ?? '' };
};

const STRENGTH_COLORS = [Colors.error, Colors.warning, Colors.secondary, Colors.success];

export const RegisterScreen: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const [form, setForm] = useState({
        fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: '', dateOfBirth: '', gender: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const strength = getPasswordStrength(form.password);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.fullName.trim()) e.fullName = 'Nama lengkap wajib diisi';
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Format email tidak valid';
        if (!form.phoneNumber.match(/^(08|\+628)[0-9]{8,11}$/)) e.phoneNumber = 'Format: 08xxxxxxxxxx';
        if (form.password.length < 8) e.password = 'Password minimal 8 karakter';
        if (form.password !== form.confirmPassword) e.confirmPassword = 'Password tidak cocok';
        if (!form.dateOfBirth) e.dateOfBirth = 'Tanggal lahir wajib diisi';
        if (!form.gender) e.gender = 'Jenis kelamin wajib diisi';
        if (!agreed) e.agreed = 'Kamu harus menyetujui syarat & ketentuan';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            // In real implementation, you would call authApi.register(form) here
            // await authApi.register(form);
            console.log('Register success, navigating to OTP');
            navigation.navigate('OTP', { phoneNumber: form.phoneNumber });
        } catch (error) {
            console.error('Registration failed:', error);
            // setErrors({ ...errors, api: 'Gagal mendaftar. Silakan coba lagi.' });
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = form.fullName && form.email && form.phoneNumber && form.password && form.confirmPassword && form.dateOfBirth && form.gender && agreed;

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title} accessibilityRole="header">Buat Akun</Text>
                <Text style={styles.subtitle}>Join CipherMeet — privasi terlindungi, koneksi nyata</Text>

                <CInput
                    label="Nama Lengkap" required
                    value={form.fullName}
                    onChangeText={(v) => setForm({ ...form, fullName: v })}
                    error={errors.fullName}
                    autoComplete="name"
                    placeholder="Nama kamu"
                />
                <CInput
                    label="Email" required
                    value={form.email}
                    onChangeText={(v) => setForm({ ...form, email: v })}
                    error={errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                />
                <CInput
                    label="Nomor HP" required
                    value={form.phoneNumber}
                    onChangeText={(v) => setForm({ ...form, phoneNumber: v })}
                    error={errors.phoneNumber}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    placeholder="08xxxxxxxxxx"
                />

                <CInput
                    label="Password" required
                    value={form.password}
                    onChangeText={(v) => setForm({ ...form, password: v })}
                    error={errors.password}
                    secureTextEntry={!showPassword}
                    trailingIcon={<Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁'}</Text>}
                    onTrailingIconPress={() => setShowPassword(!showPassword)}
                    trailingIconAccessibilityLabel={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    autoComplete="new-password"
                />

                {/* Password strength bar */}
                {form.password.length > 0 && (
                    <View style={styles.strengthContainer} accessibilityLabel={`Kekuatan password: ${strength.label}`}>
                        <View style={styles.strengthBar}>
                            {[0, 1, 2, 3].map((i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.strengthSegment,
                                        { backgroundColor: i < strength.score ? STRENGTH_COLORS[strength.score - 1] : Colors.border },
                                    ]}
                                />
                            ))}
                        </View>
                        <Text style={[styles.strengthLabel, { color: STRENGTH_COLORS[strength.score - 1] ?? Colors.textDisabled }]}>
                            {strength.label}
                        </Text>
                    </View>
                )}

                <CInput
                    label="Konfirmasi Password" required
                    value={form.confirmPassword}
                    onChangeText={(v) => setForm({ ...form, confirmPassword: v })}
                    error={errors.confirmPassword}
                    secureTextEntry
                    autoComplete="new-password"
                />
                <CInput
                    label="Tanggal Lahir" required
                    value={form.dateOfBirth}
                    onChangeText={(v) => setForm({ ...form, dateOfBirth: v })}
                    error={errors.dateOfBirth}
                    placeholder="YYYY-MM-DD"
                    keyboardType="numeric"
                />

                {/* Gender selection */}
                <View style={{ marginBottom: Spacing.md }}>
                    <Text style={styles.fieldLabel}>Jenis Kelamin *</Text>
                    <View style={styles.genderRow}>
                        {[
                            { value: 'male', label: '♂ Pria' },
                            { value: 'female', label: '♀ Wanita' },
                            { value: 'other', label: '⚧ Lainnya' },
                        ].map((g) => (
                            <TouchableOpacity
                                key={g.value}
                                onPress={() => setForm({ ...form, gender: g.value })}
                                style={[styles.genderBtn, form.gender === g.value && styles.genderBtnActive]}
                                accessibilityRole="radio"
                                accessibilityLabel={g.label}
                                accessibilityState={{ selected: form.gender === g.value }}
                            >
                                <Text style={[styles.genderBtnText, form.gender === g.value && styles.genderBtnTextActive]}>
                                    {g.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {errors.gender ? <Text style={styles.errorText}>⚠︎ {errors.gender}</Text> : null}
                </View>

                {/* T&C checkbox */}
                <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setAgreed(!agreed)}
                    accessibilityRole="checkbox"
                    accessibilityLabel="Saya setuju dengan Syarat & Ketentuan CipherMeet"
                    accessibilityState={{ checked: agreed }}
                >
                    <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
                        {agreed && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>
                        Saya setuju dengan{' '}
                        <Text style={styles.link}>Syarat & Ketentuan</Text>
                    </Text>
                </TouchableOpacity>
                {errors.agreed ? <Text style={styles.errorText}>⚠︎ {errors.agreed}</Text> : null}

                <CButton
                    label="Buat Akun"
                    onPress={handleSubmit}
                    fullWidth
                    disabled={!isFormValid}
                    loading={loading}
                    style={{ marginTop: Spacing.lg }}
                    accessibilityHint="Mendaftarkan akun dan mengirim kode OTP ke nomor HP"
                />

                <TouchableOpacity
                    style={styles.loginRow}
                    onPress={() => navigation.navigate('Login')}
                    accessibilityRole="link"
                >
                    <Text style={styles.loginText}>Sudah punya akun? <Text style={styles.link}>Masuk</Text></Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: Colors.background },
    container: { flex: 1 },
    content: { padding: Spacing.lg, paddingTop: 80, paddingBottom: Spacing['3xl'] },
    title: {
        fontFamily: FontFamily.displayFallback,
        fontSize: FontSize['3xl'],
        color: Colors.textPrimary, fontWeight: '700',
        marginBottom: Spacing.sm,
    },
    subtitle: { fontFamily: FontFamily.body, fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.xl },
    fieldLabel: { fontFamily: FontFamily.bodyMedium, fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.sm },
    genderRow: { flexDirection: 'row', gap: Spacing.sm },
    genderBtn: {
        flex: 1, minHeight: MinTouchTarget, borderRadius: 8,
        borderWidth: 1.5, borderColor: Colors.border,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: Colors.surface,
    },
    genderBtnActive: { borderColor: Colors.primary, backgroundColor: 'rgba(124,92,252,0.1)' },
    genderBtnText: { fontFamily: FontFamily.bodyMedium, fontSize: FontSize.sm, color: Colors.textSecondary },
    genderBtnTextActive: { color: Colors.primary },
    strengthContainer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: -Spacing.sm, marginBottom: Spacing.md },
    strengthBar: { flex: 1, flexDirection: 'row', gap: 4 },
    strengthSegment: { flex: 1, height: 4, borderRadius: 2 },
    strengthLabel: { fontFamily: FontFamily.bodyMedium, fontSize: FontSize.xs, minWidth: 72 },
    checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, minHeight: MinTouchTarget },
    checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
    checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    checkmark: { color: Colors.white, fontSize: 13, fontWeight: '700' },
    checkboxLabel: { flex: 1, fontFamily: FontFamily.body, fontSize: FontSize.md, color: Colors.textSecondary },
    link: { color: Colors.primary, fontFamily: FontFamily.bodyMedium },
    errorText: { color: Colors.error, fontSize: FontSize.xs, fontFamily: FontFamily.body, marginTop: 4 },
    loginRow: { alignItems: 'center', marginTop: Spacing.lg, minHeight: MinTouchTarget, justifyContent: 'center' },
    loginText: { fontFamily: FontFamily.body, fontSize: FontSize.md, color: Colors.textSecondary },
});
