import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontSize, FontFamily, Spacing, BorderRadius } from '../../theme';

interface MessageBubbleProps {
    content: string;
    isSent: boolean;
    timestamp: string;
    status?: 'sent' | 'delivered' | 'read';
    replyTo?: string;
    reaction?: string;
    isDeleted?: boolean;
    onLongPress?: () => void;
    senderName?: string; // For received messages
}

const STATUS_ICON: Record<string, string> = {
    sent: '✓',
    delivered: '✓✓',
    read: '✓✓',
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    content, isSent, timestamp, status, replyTo, reaction,
    isDeleted, onLongPress, senderName,
}) => {
    const a11yLabel = isDeleted
        ? `Pesan dihapus, ${timestamp}`
        : `${isSent ? 'Kamu' : (senderName ?? 'Dia')}: ${content}, ${timestamp}${status === 'read' ? ', sudah dibaca' : ''}`;

    return (
        <View style={[styles.wrapper, isSent ? styles.sentWrapper : styles.receivedWrapper]}>
            <TouchableOpacity
                onLongPress={onLongPress}
                style={[styles.bubble, isSent ? styles.sentBubble : styles.receivedBubble]}
                accessibilityRole="text"
                accessibilityLabel={a11yLabel}
                accessible
                delayLongPress={400}
                activeOpacity={0.9}
            >
                {/* Reply quote */}
                {replyTo && (
                    <View style={styles.replyContainer}>
                        <Text style={styles.replyText} numberOfLines={1}>{replyTo}</Text>
                    </View>
                )}

                {/* Message content */}
                <Text style={[styles.content, isDeleted && styles.deletedContent]}>
                    {isDeleted ? '🚫 Pesan telah dihapus' : content}
                </Text>

                {/* Timestamp + status */}
                <View style={styles.meta}>
                    <Text style={styles.timestamp}>{timestamp}</Text>
                    {isSent && status && (
                        <Text
                            style={[styles.statusIcon, status === 'read' && styles.statusRead]}
                            accessible={false}
                        >
                            {STATUS_ICON[status]}
                        </Text>
                    )}
                    {/* E2E lock indicator */}
                    <Text style={styles.lockIcon} accessible={false}>🔒</Text>
                </View>
            </TouchableOpacity>

            {/* Reaction */}
            {reaction && (
                <View style={[styles.reactionBadge, isSent ? styles.reactionSent : styles.reactionReceived]}>
                    <Text style={styles.reactionText}>{reaction}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: { marginVertical: 3, paddingHorizontal: Spacing.md, position: 'relative' },
    sentWrapper: { alignItems: 'flex-end' },
    receivedWrapper: { alignItems: 'flex-start' },
    bubble: {
        maxWidth: '80%',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        minWidth: 60,
    },
    sentBubble: {
        backgroundColor: Colors.primary,
        borderRadius: 18,
        borderBottomRightRadius: 4,
    },
    receivedBubble: {
        backgroundColor: Colors.card,
        borderRadius: 18,
        borderBottomLeftRadius: 4,
    },
    replyContainer: {
        borderLeftWidth: 2,
        borderLeftColor: 'rgba(255,255,255,0.4)',
        paddingLeft: Spacing.sm,
        marginBottom: 4,
    },
    replyText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: FontSize.xs,
        fontFamily: FontFamily.body,
    },
    content: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
        lineHeight: FontSize.md * 1.5,
    },
    deletedContent: { color: Colors.textSecondary, fontStyle: 'italic' },
    meta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
    timestamp: { fontSize: FontSize.xs, color: 'rgba(240,240,255,0.5)', fontFamily: FontFamily.body },
    statusIcon: { fontSize: FontSize.xs, color: 'rgba(240,240,255,0.6)' },
    statusRead: { color: Colors.success },
    lockIcon: { fontSize: 9, opacity: 0.4 },
    reactionBadge: {
        position: 'absolute', bottom: -8,
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.full,
        paddingHorizontal: 6, paddingVertical: 2,
        borderWidth: 1.5,
        borderColor: Colors.border,
    },
    reactionSent: { right: Spacing.md + 8 },
    reactionReceived: { left: Spacing.md + 8 },
    reactionText: { fontSize: 14 },
});
