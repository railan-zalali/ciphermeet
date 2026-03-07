import React, { memo, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ListRenderItem
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, FontSize, FontFamily, Spacing, MinTouchTarget, BorderRadius } from '../../theme';
import { CAvatar } from '../../components/atoms/CAvatar/CAvatar';
import { RootStackParams } from '../../navigation/RootNavigator';

type Nav = StackNavigationProp<RootStackParams>;

interface ConversationItem {
    id: string; partnerName: string; partnerAvatar?: string;
    lastMessageTime: string; unreadCount: number; isOnline: boolean;
}

const MOCK_CONVERSATIONS: ConversationItem[] = [
    { id: 'c1', partnerName: 'Sari Dewi', lastMessageTime: '2 mnt lalu', unreadCount: 3, isOnline: true },
    { id: 'c2', partnerName: 'Budi Santoso', lastMessageTime: '1 jam lalu', unreadCount: 0, isOnline: false },
    { id: 'c3', partnerName: 'Dewi Rahayu', lastMessageTime: 'Kemarin', unreadCount: 1, isOnline: false },
];

const ItemSeparator = () => <View style={styles.separator} />;
const ListEmpty = () => (
    <View style={styles.empty}>
        <Text style={styles.emptyText}>💬</Text>
        <Text style={styles.emptyMsg}>Belum ada percakapan</Text>
        <Text style={styles.emptySubMsg}>Match dengan seseorang untuk mulai chat</Text>
    </View>
);

const ConversationListItem = memo(({ item, onPress }: { item: ConversationItem; onPress: (item: ConversationItem) => void }) => (
    <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => onPress(item)}
        accessibilityRole="button"
        accessibilityLabel={`${item.partnerName}${item.unreadCount > 0 ? `, ${item.unreadCount} pesan belum dibaca` : ''}${item.isOnline ? ', sedang online' : ''}, ${item.lastMessageTime}`}
    >
        <CAvatar
            name={item.partnerName}
            size="md"
            isOnline={item.isOnline}
            accessibilityLabel={`Foto profil ${item.partnerName}`}
        />
        <View style={styles.conversationContent}>
            <View style={styles.conversationTop}>
                <Text style={styles.partnerName} numberOfLines={1}>{item.partnerName}</Text>
                <Text style={styles.timeText}>{item.lastMessageTime}</Text>
            </View>
            <View style={styles.conversationBottom}>
                <Text style={styles.previewText} numberOfLines={1}>
                    🔒 Terenkripsi
                </Text>
                {item.unreadCount > 0 && (
                    <View style={styles.unreadBadge} accessible={false}>
                        <Text style={styles.unreadText}>{item.unreadCount}</Text>
                    </View>
                )}
            </View>
        </View>
    </TouchableOpacity>
));

export const ChatListScreen: React.FC = () => {
    const navigation = useNavigation<Nav>();

    const handlePress = useCallback((item: ConversationItem) => {
        navigation.navigate('ChatRoom', {
            conversationId: item.id,
            partnerName: item.partnerName,
        });
    }, [navigation]);

    const renderItem: ListRenderItem<ConversationItem> = useCallback(({ item }) => (
        <ConversationListItem item={item} onPress={handlePress} />
    ), [handlePress]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle} accessibilityRole="header">Pesan</Text>
                    <TouchableOpacity
                        style={styles.e2eeBadge}
                        accessibilityLabel="Semua pesan dienkripsi end-to-end dengan Signal Protocol"
                        accessibilityRole="button"
                    >
                        <Text style={styles.e2eeText}>🔒 Semua pesan terenkripsi E2EE</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={MOCK_CONVERSATIONS}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ItemSeparatorComponent={ItemSeparator}
                ListEmptyComponent={ListEmpty}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { padding: Spacing.lg, paddingTop: Spacing.xl },
    headerTitle: { fontFamily: FontFamily.displayFallback, fontSize: FontSize['2xl'], color: Colors.textPrimary, fontWeight: '700' },
    e2eeBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    e2eeText: { fontFamily: FontFamily.body, fontSize: FontSize.xs, color: Colors.success },
    conversationItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
        minHeight: MinTouchTarget + 16,
    },
    conversationContent: { flex: 1, marginLeft: Spacing.md },
    conversationTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    partnerName: { fontFamily: FontFamily.bodyMedium, fontSize: FontSize.md, color: Colors.textPrimary, flex: 1 },
    timeText: { fontFamily: FontFamily.body, fontSize: FontSize.xs, color: Colors.textSecondary },
    conversationBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    previewText: { fontFamily: FontFamily.body, fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
    unreadBadge: {
        backgroundColor: Colors.primary, borderRadius: BorderRadius.full,
        minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 5,
    },
    unreadText: { color: Colors.white, fontFamily: FontFamily.bodyBold, fontSize: FontSize.xs },
    separator: { height: 1, backgroundColor: Colors.border, marginLeft: 88 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: Spacing.sm },
    emptyText: { fontSize: 48 },
    emptyMsg: { fontFamily: FontFamily.bodyBold, fontSize: FontSize.xl, color: Colors.textPrimary },
    emptySubMsg: { fontFamily: FontFamily.body, fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center' },
});
