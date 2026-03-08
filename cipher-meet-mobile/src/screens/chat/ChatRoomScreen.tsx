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

import { withObservables } from '@nozbe/watermelondb/react';
import { database } from '../../db';
import { Message } from '../../db/models/Message';
import { Q } from '@nozbe/watermelondb';

type Nav = StackNavigationProp<RootStackParams>;
type RouteT = RouteProp<RootStackParams, 'ChatRoom'>;

// ─── Component Props ─────────────────────────────────────────────────────────────
interface ChatRoomProps {
    messages: Message[]; // Injected by withObservables
}

export const ChatRoomScreenBase: React.FC<ChatRoomProps> = ({ messages }) => {
    const navigation = useNavigation<Nav>();
    const route = useRoute<RouteT>();
    const { partnerName, conversationId } = route.params; // conversationId is remoteId
    const [inputText, setInputText] = useState('');
    const [isTyping] = useState(false);

    const sendMessage = async () => {
        if (!inputText.trim()) return;
        
        // Optimistic UI update handled by WatermelonDB observation
        await database.write(async () => {
            const conversations = await database.get('conversations').query(Q.where('remote_id', conversationId)).fetch();
            const conversation = conversations[0];
            
            if (conversation) {
                await database.get<Message>('messages').create(m => {
                    m.conversation.set(conversation);
                    m.content = inputText.trim();
                    m.isSent = true; // Local flag
                    m.senderId = 'me'; // Replace with real user ID
                    m.status = 'sending';
                    m.messageType = 'text';
                });
            }
        });

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
                            isSent={item.senderId === 'me'} // Logic check
                            timestamp={item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            status={item.status as any}
                            senderName={partnerName}
                            onLongPress={() => {/* Show context menu */ }}
                        />
                    )}
                    contentContainerStyle={styles.messageList}
                    inverted={true} // WatermelonDB usually sorts desc, so invert list
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

// ─── HOC for WatermelonDB ──────────────────────────────────────────────────────
const enhance = withObservables(['route'], ({ route }) => ({
    messages: database.get<Message>('messages')
        .query(
            Q.on('conversations', 'remote_id', route.params.conversationId),
            Q.sortBy('created_at', Q.desc)
        ),
}));

export const ChatRoomScreen = enhance(ChatRoomScreenBase);

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
