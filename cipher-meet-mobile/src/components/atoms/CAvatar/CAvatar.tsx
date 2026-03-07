import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontFamily } from '../../../theme';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface CAvatarProps {
    uri?: string;
    photoUrl?: string; // Alias for uri (convenience prop)
    name?: string;
    size?: AvatarSize;
    isOnline?: boolean;
    isVerified?: boolean;
    accessibilityLabel?: string;
    style?: ViewStyle;
}

const SIZES: Record<AvatarSize, number> = {
    xs: 32,
    sm: 40,
    md: 56,
    lg: 72,
    xl: 96,
};

export const CAvatar: React.FC<CAvatarProps> = ({
    uri,
    photoUrl,
    name = '',
    size = 'md',
    isOnline = false,
    isVerified = false,
    accessibilityLabel,
    style,
}) => {
    const dim = SIZES[size];
    const resolvedUri = uri ?? photoUrl;
    const initials = name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('');

    const a11yLabel = accessibilityLabel ?? `Foto profil ${name ?? 'pengguna'}${isOnline ? ', sedang online' : ''}${isVerified ? ', terverifikasi' : ''}`;
    const indicatorSize = Math.max(10, dim * 0.22);

    return (
        <View
            style={[styles.container, style]}
            accessible
            accessibilityLabel={a11yLabel}
            accessibilityRole="image"
        >
            {resolvedUri ? (
                <Image
                    source={{ uri: resolvedUri }}
                    style={[styles.image, { width: dim, height: dim, borderRadius: dim / 2 }]}
                    accessible={false}
                />
            ) : (
                <View
                    style={[
                        styles.placeholder,
                        { width: dim, height: dim, borderRadius: dim / 2 },
                    ]}
                >
                    <Text style={[styles.initials, { fontSize: dim * 0.35 }]}>{initials}</Text>
                </View>
            )}

            {/* Online indicator */}
            {isOnline && (
                <View
                    style={[
                        styles.onlineIndicator,
                        {
                            width: indicatorSize,
                            height: indicatorSize,
                            borderRadius: indicatorSize / 2,
                            right: 0,
                            bottom: 0,
                        },
                    ]}
                    accessible={false}
                />
            )}

            {/* Verified badge */}
            {isVerified && (
                <View
                    style={[
                        styles.verifiedBadge,
                        { width: indicatorSize + 4, height: indicatorSize + 4, borderRadius: (indicatorSize + 4) / 2 },
                    ]}
                    accessible={false}
                >
                    <Text style={{ fontSize: indicatorSize * 0.7, color: Colors.background }}>✓</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { position: 'relative' },
    image: { resizeMode: 'cover' },
    placeholder: {
        backgroundColor: Colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    initials: {
        color: Colors.primary,
        fontFamily: FontFamily.bodyBold,
    },
    onlineIndicator: {
        position: 'absolute',
        backgroundColor: Colors.success,
        borderWidth: 2,
        borderColor: Colors.background,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.background,
    },
});
