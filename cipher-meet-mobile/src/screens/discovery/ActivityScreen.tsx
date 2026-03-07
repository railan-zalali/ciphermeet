import React from 'react';
import {
    View, Text, FlatList, SafeAreaView, StatusBar,
    TouchableOpacity, StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, FontSize, FontFamily, Spacing, BorderRadius, MinTouchTarget } from '../../theme';
import { CAvatar } from '../../components/atoms/CAvatar/CAvatar';
import { useMatches } from '../../hooks/useDiscovery';
import { RootStackParams } from '../../navigation/RootNavigator';

type Nav = StackNavigationProp<RootStackParams>;

export const ActivityScreen: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const { data: matches, isLoading, refetch } = useMatches();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <View style={styles.header}>
                <Text style={styles.title} accessibilityRole="header">Aktivitas</Text>
                <Text style={styles.subtitle}>Orang yang saling suka denganmu</Text>
            </View>

            {isLoading && (
                <View style={styles.center}>
                    <Text style={styles.loadingText}>Memuat match...</Text>
                </View>
            )}

            <FlatList
                data={matches ?? []}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.grid}
                onRefresh={refetch}
                refreshing={isLoading}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.matchCard}
                        onPress={() =>
                            navigation.navigate('ChatRoom', {
                                conversationId: item.id,
                                partnerName: item.partner.name,
                            })
                        }
                        accessibilityRole="button"
                        accessibilityLabel={`Match dengan ${item.partner.name}. Ketuk untuk mulai chat.`}
                    >
                        <CAvatar
                            name={item.partner.name}
                            photoUrl={item.partner.photos?.[0]}
                            size="xl"
                            accessibilityLabel={`Foto ${item.partner.name}`}
                        />
                        <Text style={styles.matchName} numberOfLines={1}>{item.partner.name}</Text>
                        <Text style={styles.matchDate}>
                            {new Date(item.matchedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={styles.center}>
                            <Text style={styles.emptyIcon}>💫</Text>
                            <Text style={styles.emptyTitle}>Belum ada match</Text>
                            <Text style={styles.emptyMsg}>Mulai swipe untuk menemukan orang yang cocok</Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
    title: { fontFamily: FontFamily.displayFallback, fontSize: FontSize['2xl'], color: Colors.textPrimary, fontWeight: '700' },
    subtitle: { fontFamily: FontFamily.body, fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
    row: { gap: Spacing.md },
    grid: { padding: Spacing.lg, gap: Spacing.md },
    matchCard: {
        flex: 1, backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
        padding: Spacing.md, alignItems: 'center', gap: Spacing.sm, minHeight: 160,
    },
    matchName: { fontFamily: FontFamily.bodyMedium, fontSize: FontSize.md, color: Colors.textPrimary },
    matchDate: { fontFamily: FontFamily.body, fontSize: FontSize.xs, color: Colors.textSecondary },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: Spacing.xl },
    loadingText: { color: Colors.textSecondary, fontFamily: FontFamily.body, fontSize: FontSize.md },
    emptyIcon: { fontSize: 56 },
    emptyTitle: { fontFamily: FontFamily.bodyBold, fontSize: FontSize.xl, color: Colors.textPrimary, marginTop: Spacing.md },
    emptyMsg: { fontFamily: FontFamily.body, fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },
});
