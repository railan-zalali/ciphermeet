import React, { useState } from 'react';
import {
    View, Text, FlatList, TextInput, TouchableOpacity,
    StyleSheet, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, FontSize, FontFamily, Spacing, BorderRadius, MinTouchTarget } from '../../theme';
import { CAvatar } from '../../components/atoms/CAvatar/CAvatar';
import { MessageBubble } from '../../components/molecules/MessageBubble/MessageBubble';
import { EncryptionBanner } from '../../components/molecules/EncryptionBanner/EncryptionBanner';
import { RootStackParams } from '../../navigation/RootNavigator';

type Nav = StackNavigationProp<RootStackParams>;
type RouteT = RouteProp<RootStackParams, 'ChatRoom'>;

// ─── Message type ─────────────────────────────────────────────────────────────
interface Message {
    id: string;
    content: string;
    isSent: boolean;
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
}

const MOCK_MESSAGES: Message[] = [
    { id: 'm1', content: 'Heyy! 👋 Match kita! Seneng banget~', isSent: false, timestamp: '10:24', status: 'read' },
    { id: 'm2', content: 'Hai! Iya haha, aku juga seneng 😊 Nama kamu Sari?', isSent: true, timestamp: '10:25', status: 'read' },
    { id: 'm3', content: 'Yapp! Kamu Budi? Suka gaming juga ternyata~', isSent: false, timestamp: '10:26', status: 'read' },
];

export const ChatRoomScreen: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<RouteT>();
    const { partnerName } = route.params;
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [inputText, setInputText] = useState('');
    const [isTyping] = useState(false);

    const sendMessage = () => {
        if (!inputText.trim()) return;
        setMessages((prev) => [
            ...prev,
            {
                id: `m${Date.now()}`, content: inputText.trim(),
                isSent: true, timestamp: 'Sekarang', status: 'sent',
            },
        ]);
        setInputText('');
        // TODO: encrypt with Signal Protocol + emit via Socket.io
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backBtn}
                        accessibilityRole="button"
                        accessibilityLabel="Kembali ke daftar pesan"
                    >
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <CAvatar name={partnerName} size="sm" isOnline />
                    <View style={styles.headerInfo}>
                        <Text style={styles.partnerName} numberOfLines={1}>{partnerName}</Text>
                        <Text style={styles.onlineStatus}>Sedang online</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.headerAction}
                        accessibilityRole="button"
                        accessibilityLabel="Lihat keamanan enkripsi"
                    >
                        <Text style={styles.lockIcon}>🔐</Text>
                    </TouchableOpacity>
                </View>

                {/* E2EE Banner */}
                <EncryptionBanner partnerName={partnerName} />

                {/* Messages */}
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <MessageBubble
                            content={item.content}
                            isSent={item.isSent}
                            timestamp={item.timestamp}
                            status={item.status}
                            senderName={partnerName}
                            onLongPress={() => {/* Show context menu */ }}
                        />
                    )}
                    contentContainerStyle={styles.messageList}
                    inverted={false}
                />

                {/* Typing indicator */}
                {isTyping && (
                    <Text style={styles.typingIndicator} accessibilityLiveRegion="polite">
                        {partnerName} sedang mengetik...
                    </Text>
                )}

                {/* Input bar */}
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.textInput}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Pesan terenkripsi..."
                        placeholderTextColor={Colors.textDisabled}
                        multiline
                        maxLength={2000}
                        accessibilityLabel="Ketik pesan terenkripsi"
                    />
                    <TouchableOpacity
                        style={styles.attachBtn}
                        accessibilityRole="button"
                        accessibilityLabel="Lampiran"
                    >
                        <Text style={{ fontSize: 20 }}>📎</Text>
                    </TouchableOpacity>
                    {inputText.length > 0 ? (
                        <TouchableOpacity
                            style={styles.sendBtn}
                            onPress={sendMessage}
                            accessibilityRole="button"
                            accessibilityLabel="Kirim pesan"
                        >
                            <Text style={styles.sendIcon}>➤</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.micBtn}
                            accessibilityRole="button"
                            accessibilityLabel="Rekam pesan suara"
                        >
                            <Text style={{ fontSize: 20 }}>🎤</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    flex: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
        borderBottomWidth: 1, borderBottomColor: Colors.border,
        gap: Spacing.sm,
    },
    backBtn: { minWidth: MinTouchTarget, minHeight: MinTouchTarget, alignItems: 'center', justifyContent: 'center' },
    backIcon: { fontSize: 22, color: Colors.primary },
    headerInfo: { flex: 1 },
    partnerName: { fontFamily: FontFamily.bodyBold, fontSize: FontSize.md, color: Colors.textPrimary },
    onlineStatus: { fontFamily: FontFamily.body, fontSize: FontSize.xs, color: Colors.success },
    headerAction: { minWidth: MinTouchTarget, minHeight: MinTouchTarget, alignItems: 'center', justifyContent: 'center' },
    lockIcon: { fontSize: 18 },
    messageList: { paddingVertical: Spacing.md, paddingBottom: Spacing.lg },
    typingIndicator: { fontFamily: FontFamily.body, fontSize: FontSize.xs, color: Colors.textSecondary, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
    inputBar: {
        flexDirection: 'row', alignItems: 'flex-end',
        paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
        borderTopWidth: 1, borderTopColor: Colors.border,
        backgroundColor: Colors.surface, gap: Spacing.sm,
    },
    textInput: {
        flex: 1, backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
        fontFamily: FontFamily.body, fontSize: FontSize.md, color: Colors.textPrimary,
        maxHeight: 100, minHeight: MinTouchTarget,
    },
    attachBtn: { minWidth: 40, minHeight: MinTouchTarget, alignItems: 'center', justifyContent: 'center' },
    micBtn: { minWidth: MinTouchTarget, minHeight: MinTouchTarget, alignItems: 'center', justifyContent: 'center' },
    sendBtn: {
        width: MinTouchTarget, height: MinTouchTarget,
        borderRadius: BorderRadius.full, backgroundColor: Colors.primary,
        alignItems: 'center', justifyContent: 'center',
    },
    sendIcon: { color: Colors.white, fontSize: 18 },
});
