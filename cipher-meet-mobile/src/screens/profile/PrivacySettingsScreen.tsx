import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontSize, FontFamily, Spacing, MinTouchTarget } from '../../theme';

export const PrivacySettingsScreen: React.FC = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backBtn}
                >
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Privasi</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.placeholder}>Pengaturan privasi belum tersedia.</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
    backBtn: { minHeight: MinTouchTarget, minWidth: MinTouchTarget, justifyContent: 'center' },
    backText: { color: Colors.primary, fontSize: FontSize.xl, fontFamily: FontFamily.bodyBold },
    title: { fontFamily: FontFamily.displayFallback, fontSize: FontSize.xl, color: Colors.textPrimary, fontWeight: '700' },
    content: { flex: 1, padding: Spacing.lg, alignItems: 'center', justifyContent: 'center' },
    placeholder: { fontFamily: FontFamily.body, fontSize: FontSize.md, color: Colors.textSecondary },
});
