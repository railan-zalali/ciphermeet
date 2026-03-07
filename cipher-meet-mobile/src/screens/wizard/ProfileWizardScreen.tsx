import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity,
    ScrollView, TextInput, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, FontSize, FontFamily, Spacing, BorderRadius, MinTouchTarget } from '../../theme';
import { CButton } from '../../components/atoms/CButton/CButton';
import { CChip } from '../../components/atoms/CChip/CChip';
import { CSlider } from '../../components/atoms/CSlider/CSlider';
import { AuthStackParams } from '../../navigation/RootNavigator';
import { useAuthStore } from '../../stores/authStore';

type Nav = StackNavigationProp<AuthStackParams, 'ProfileWizard'>;

// ─── Data ─────────────────────────────────────────────────────────────────────
const STEPS = [
    { num: 1, title: '📷 Foto Profil', desc: 'Upload hingga 6 foto terbaikmu' },
    { num: 2, title: '✍️ Bio & Kepribadian', desc: 'Ceritakan tentang dirimu' },
    { num: 3, title: '💑 Preferensi Pasangan', desc: 'Siapa yang kamu cari?' },
    { num: 4, title: '📍 Lokasi', desc: 'Temukan orang di sekitarmu' },
    { num: 5, title: '✅ Verifikasi Selfie', desc: 'Pastikan akun kamu asli' },
];

const MBTI_TYPES = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

const INTEREST_OPTIONS = [
    '🎵 Musik', '🎮 Gaming', '✈️ Travel', '📚 Membaca', '🍳 Memasak',
    '🏃 Olahraga', '🎨 Seni', '📸 Fotografi', '🎬 Film', '☕ Kopi',
    '🌿 Alam', '💻 Teknologi', '🐾 Hewan', '🎭 Theater', '🧘 Yoga',
];

interface WizardState {
    photos: string[];          // URIs
    bio: string;
    mbti: string;
    interests: string[];
    ageMin: number;
    ageMax: number;
    maxDistanceKm: number;
    preferMale: boolean;
    preferFemale: boolean;
    locationGranted: boolean;
    selfieVerified: boolean;
}

// ─── Step Components ──────────────────────────────────────────────────────────
const StepPhotos: React.FC<{ state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }> = ({ state, setState }) => (
    <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.sectionHint}>Pilih minimal 1 foto. Foto pertama jadi foto utamamu.</Text>
        <View style={s.photoGrid}>
            {Array.from({ length: 6 }).map((_, i) => {
                const uri = state.photos[i];
                return (
                    <TouchableOpacity
                        key={i}
                        style={[s.photoSlot, uri ? s.photoSlotFilled : s.photoSlotEmpty]}
                        onPress={() => {
                            // Real: open image picker — for now show alert
                            Alert.alert('Upload Foto', `Pilih foto ke-${i + 1}`, [
                                {
                                    text: 'Gunakan placeholder', onPress: () => {
                                        const updated = [...state.photos];
                                        updated[i] = `https://picsum.photos/seed/${Date.now()}/400/500`;
                                        setState((prev) => ({ ...prev, photos: updated }));
                                    },
                                },
                                { text: 'Batal', style: 'cancel' },
                            ]);
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={uri ? `Foto ${i + 1} sudah dipilih. Ketuk untuk ganti.` : `Tambah foto ${i + 1}. Wajib jika foto pertama.`}
                    >
                        {uri ? (
                            <Text style={{ fontSize: 32 }}>🖼️</Text>
                        ) : (
                            <Text style={s.photoSlotIcon}>{i === 0 ? '📷' : '+'}</Text>
                        )}
                        {i === 0 && <Text style={s.photoMainLabel}>Utama</Text>}
                    </TouchableOpacity>
                );
            })}
        </View>
        <Text style={s.photoCaptionHint}>
            💡 Foto dengan wajah jelas meningkatkan match hingga 3x lipat
        </Text>
    </ScrollView>
);

const StepBio: React.FC<{ state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }> = ({ state, setState }) => (
    <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.fieldLabel}>Bio</Text>
        <TextInput
            style={s.textArea}
            value={state.bio}
            onChangeText={(text) => setState((p) => ({ ...p, bio: text }))}
            placeholder="Ceritakan tentang dirimu, hobimu, atau hal unik yang kamu sukai..."
            placeholderTextColor={Colors.textDisabled}
            multiline
            maxLength={300}
            accessibilityLabel="Bio profil"
            accessibilityHint="Maksimal 300 karakter"
        />
        <Text style={s.charCount}>{state.bio.length}/300</Text>

        <Text style={[s.fieldLabel, { marginTop: Spacing.lg }]}>Tipe MBTI (opsional)</Text>
        <View style={s.chipWrap}>
            {MBTI_TYPES.map((type) => (
                <CChip
                    key={type}
                    label={type}
                    selected={state.mbti === type}
                    onPress={() => setState((p) => ({ ...p, mbti: p.mbti === type ? '' : type }))}
                />
            ))}
        </View>

        <Text style={[s.fieldLabel, { marginTop: Spacing.lg }]}>Minat & Hobi</Text>
        <View style={s.chipWrap}>
            {INTEREST_OPTIONS.map((interest) => (
                <CChip
                    key={interest}
                    label={interest}
                    selected={state.interests.includes(interest)}
                    onPress={() =>
                        setState((p) => ({
                            ...p,
                            interests: p.interests.includes(interest)
                                ? p.interests.filter((i) => i !== interest)
                                : [...p.interests, interest].slice(0, 8),
                        }))
                    }
                />
            ))}
        </View>
        <Text style={s.sectionHint}>Pilih hingga 8 minat</Text>
    </ScrollView>
);

const StepPreferences: React.FC<{ state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }> = ({ state, setState }) => (
    <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.sectionHint}>Atur preferensi pasangan yang kamu cari</Text>

        <Text style={[s.fieldLabel, { marginTop: Spacing.md }]}>Rentang Usia</Text>
        <CSlider
            label={`Minimum: ${state.ageMin} tahun`}
            value={state.ageMin} min={18} max={60} step={1}
            onValueChange={(v) => setState((p) => ({ ...p, ageMin: Math.min(v, p.ageMax - 1) }))}
            accessibilityLabel="Usia minimum pasangan"
        />
        <View style={{ height: Spacing.md }} />
        <CSlider
            label={`Maksimum: ${state.ageMax} tahun`}
            value={state.ageMax} min={18} max={70} step={1}
            onValueChange={(v) => setState((p) => ({ ...p, ageMax: Math.max(v, p.ageMin + 1) }))}
            accessibilityLabel="Usia maksimum pasangan"
        />

        <Text style={[s.fieldLabel, { marginTop: Spacing.xl }]}>Jarak Maksimum</Text>
        <CSlider
            label={`${state.maxDistanceKm} km`}
            value={state.maxDistanceKm} min={5} max={200} step={5}
            onValueChange={(v) => setState((p) => ({ ...p, maxDistanceKm: v }))}
            accessibilityLabel="Jarak maksimum untuk pencarian"
        />

        <Text style={[s.fieldLabel, { marginTop: Spacing.xl }]}>Tertarik dengan</Text>
        <View style={s.genderRow}>
            {[
                { label: '🙍‍♂️ Pria', key: 'preferMale' as const },
                { label: '🙍‍♀️ Wanita', key: 'preferFemale' as const },
            ].map(({ label, key }) => (
                <TouchableOpacity
                    key={key}
                    style={[s.genderChip, state[key] && s.genderChipActive]}
                    onPress={() => setState((p) => ({ ...p, [key]: !p[key] }))}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: state[key] }}
                    accessibilityLabel={label}
                >
                    <Text style={[s.genderChipText, state[key] && s.genderChipTextActive]}>{label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    </ScrollView>
);

const StepLocation: React.FC<{ state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }> = ({ state, setState }) => (
    <View style={s.centerContent}>
        <Text style={{ fontSize: 64 }}>📍</Text>
        <Text style={s.centerTitle}>Izin Lokasi</Text>
        <Text style={s.centerDesc}>
            CipherMeet membutuhkan akses lokasi untuk menampilkan orang-orang di sekitarmu.
            Lokasimu tidak pernah ditampilkan secara tepat kepada pengguna lain.
        </Text>
        {state.locationGranted ? (
            <View style={s.successBadge}>
                <Text style={s.successText}>✅ Lokasi berhasil diizinkan!</Text>
            </View>
        ) : (
            <CButton
                label="Izinkan Akses Lokasi"
                onPress={() => {
                    // Real: use react-native-geolocation-service or expo-location
                    Alert.alert('Izin Lokasi', 'Izinkan CipherMeet mengakses lokasimu?', [
                        {
                            text: 'Izinkan', onPress: () =>
                                setState((p) => ({ ...p, locationGranted: true })),
                        },
                        { text: 'Nanti', style: 'cancel' },
                    ]);
                }}
                accessibilityHint="Meminta izin akses lokasi dari sistem"
            />
        )}
        <Text style={s.privacyNote}>
            🔒 Lokasi dienkripsi dan hanya digunakan untuk menghitung jarak.
            Kamu bisa menonaktifkan ini kapan saja di Pengaturan Privasi.
        </Text>
    </View>
);

const StepVerification: React.FC<{ state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }> = ({ state, setState }) => (
    <View style={s.centerContent}>
        <Text style={{ fontSize: 64 }}>{state.selfieVerified ? '✅' : '🤳'}</Text>
        <Text style={s.centerTitle}>{state.selfieVerified ? 'Terverifikasi!' : 'Verifikasi Wajah'}</Text>
        <Text style={s.centerDesc}>
            {state.selfieVerified
                ? 'Akunmu sudah terverifikasi. Badge ✓ akan muncul di profilmu.'
                : 'Ambil selfie untuk memverifikasi bahwa akunmu asli. Foto tidak disimpan setelah verifikasi.'}
        </Text>
        {!state.selfieVerified && (
            <>
                <CButton
                    label="📸 Ambil Selfie Sekarang"
                    onPress={() => {
                        Alert.alert('Verifikasi Selfie', 'Arahkan kamera ke wajahmu', [
                            {
                                text: 'Verifikasi (Demo)', onPress: () =>
                                    setState((p) => ({ ...p, selfieVerified: true })),
                            },
                            { text: 'Nanti', style: 'cancel' },
                        ]);
                    }}
                    style={{ width: '90%' }}
                    accessibilityHint="Buka kamera untuk verifikasi wajah"
                />
                <Text style={s.skipHint}>Kamu bisa melewati ini dan verifikasi nanti</Text>
            </>
        )}
        <View style={s.verifyBenefits}>
            {['Match lebih banyak', 'Muncul lebih tinggi di feed', 'Badge ✓ di profil'].map((b) => (
                <Text key={b} style={s.verifyBenefit}>✦ {b}</Text>
            ))}
        </View>
    </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export const ProfileWizardScreen: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const { setAuthenticated } = useAuthStore();
    const [step, setStep] = useState(1);
    const [state, setState] = useState<WizardState>({
        photos: [], bio: '', mbti: '', interests: [],
        ageMin: 22, ageMax: 35, maxDistanceKm: 50,
        preferMale: true, preferFemale: true,
        locationGranted: false, selfieVerified: false,
    });

    const isLast = step === STEPS.length;
    const current = STEPS[step - 1];

    const handleFinish = useCallback(() => {
        // TODO: call API to save wizard data using usersApi.updateProfile
        Alert.alert('Profil Tersimpan! 🎉', 'Selamat datang di CipherMeet!', [
            {
                text: 'Mulai Cari Match', onPress: () => {
                    // Mark as authenticated to show main tabs
                    // In real app, auth was already set on OTP verify — just navigate
                    navigation.navigate('Onboarding'); // RootNavigator will handle redirection
                },
            },
        ]);
    }, [navigation]);

    const renderStep = () => {
        switch (step) {
            case 1: return <StepPhotos state={state} setState={setState} />;
            case 2: return <StepBio state={state} setState={setState} />;
            case 3: return <StepPreferences state={state} setState={setState} />;
            case 4: return <StepLocation state={state} setState={setState} />;
            case 5: return <StepVerification state={state} setState={setState} />;
            default: return null;
        }
    };

    return (
        <SafeAreaView style={s.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

            {/* Progress bar */}
            <View style={s.progressRow} accessibilityLabel={`Langkah ${step} dari ${STEPS.length}`}>
                {STEPS.map((st) => (
                    <View key={st.num} style={[s.progressBar, step >= st.num && s.progressBarActive]} accessible={false} />
                ))}
            </View>

            {/* Header */}
            <View style={s.header}>
                <Text style={s.stepLabel}>Langkah {step} / {STEPS.length}</Text>
                <Text style={s.title} accessibilityRole="header">{current?.title}</Text>
                <Text style={s.desc}>{current?.desc}</Text>
            </View>

            {/* Step content */}
            <View style={{ flex: 1, paddingHorizontal: Spacing.lg }}>{renderStep()}</View>

            {/* Footer nav */}
            <View style={s.footer}>
                {step > 1 && (
                    <TouchableOpacity
                        onPress={() => setStep(step - 1)}
                        style={s.backBtn}
                        accessibilityRole="button"
                        accessibilityLabel="Kembali ke langkah sebelumnya"
                    >
                        <Text style={s.backText}>← Kembali</Text>
                    </TouchableOpacity>
                )}
                <CButton
                    label={isLast ? '🎉 Selesai' : 'Lanjut →'}
                    onPress={isLast ? handleFinish : () => setStep(step + 1)}
                    style={s.nextBtn}
                    accessibilityHint={isLast ? 'Simpan profil dan mulai menggunakan CipherMeet' : `Lanjut ke langkah ${step + 1}`}
                />
            </View>
        </SafeAreaView>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    progressRow: { flexDirection: 'row', gap: Spacing.xs, paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
    progressBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.border },
    progressBarActive: { backgroundColor: Colors.primary },
    header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
    stepLabel: { fontFamily: FontFamily.body, fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 4 },
    title: { fontFamily: FontFamily.displayFallback, fontSize: FontSize.xl, color: Colors.textPrimary, fontWeight: '700' },
    desc: { fontFamily: FontFamily.body, fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
    footer: { flexDirection: 'row', padding: Spacing.lg, gap: Spacing.md, alignItems: 'center' },
    backBtn: { minHeight: MinTouchTarget, justifyContent: 'center', paddingHorizontal: Spacing.md },
    backText: { color: Colors.primary, fontFamily: FontFamily.bodyMedium, fontSize: FontSize.md },
    nextBtn: { flex: 1 },
    // Step 1 — Photos
    sectionHint: { fontFamily: FontFamily.body, fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md },
    photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    photoSlot: {
        width: '31%', aspectRatio: 0.75, borderRadius: BorderRadius.md,
        alignItems: 'center', justifyContent: 'center',
    },
    photoSlotEmpty: { borderWidth: 1.5, borderColor: Colors.border, borderStyle: 'dashed' },
    photoSlotFilled: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.primary },
    photoSlotIcon: { color: Colors.textDisabled, fontSize: 28 },
    photoMainLabel: { fontFamily: FontFamily.bodyBold, fontSize: FontSize.xs, color: Colors.primary, marginTop: 4 },
    photoCaptionHint: { fontFamily: FontFamily.body, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: Spacing.md, textAlign: 'center' },
    // Step 2 — Bio
    fieldLabel: { fontFamily: FontFamily.bodyBold, fontSize: FontSize.md, color: Colors.textPrimary, marginBottom: Spacing.sm },
    textArea: {
        backgroundColor: Colors.card, borderRadius: BorderRadius.md,
        borderWidth: 1, borderColor: Colors.border, padding: Spacing.md,
        color: Colors.textPrimary, fontFamily: FontFamily.body, fontSize: FontSize.md,
        minHeight: 100, textAlignVertical: 'top',
    },
    charCount: { fontFamily: FontFamily.body, fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'right', marginTop: 4 },
    chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    // Step 3 — Preferences
    genderRow: { flexDirection: 'row', gap: Spacing.md },
    genderChip: {
        flex: 1, padding: Spacing.md, borderRadius: BorderRadius.md,
        borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center',
        minHeight: MinTouchTarget, justifyContent: 'center',
    },
    genderChipActive: { borderColor: Colors.primary, backgroundColor: 'rgba(124,92,252,0.1)' },
    genderChipText: { fontFamily: FontFamily.bodyMedium, fontSize: FontSize.md, color: Colors.textSecondary },
    genderChipTextActive: { color: Colors.primary },
    // Step 4 & 5 — Center layout
    centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, paddingHorizontal: Spacing.sm },
    centerTitle: { fontFamily: FontFamily.displayFallback, fontSize: FontSize.xl, color: Colors.textPrimary, fontWeight: '700', textAlign: 'center' },
    centerDesc: { fontFamily: FontFamily.body, fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center' },
    successBadge: { backgroundColor: 'rgba(0,200,100,0.1)', borderRadius: BorderRadius.md, padding: Spacing.md },
    successText: { color: Colors.success, fontFamily: FontFamily.bodyBold, fontSize: FontSize.md },
    privacyNote: { fontFamily: FontFamily.body, fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.lg },
    skipHint: { fontFamily: FontFamily.body, fontSize: FontSize.xs, color: Colors.textSecondary },
    verifyBenefits: { gap: Spacing.xs, marginTop: Spacing.md },
    verifyBenefit: { fontFamily: FontFamily.bodyMedium, fontSize: FontSize.sm, color: Colors.textSecondary },
});
