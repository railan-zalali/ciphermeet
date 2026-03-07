import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { MMKV } from 'react-native-mmkv';

const tokenStorage = new MMKV({ id: 'auth-tokens' });

// ─── Types ─────────────────────────────────────────────────────────────────────
interface IncomingMessage {
    messageId: string; conversationId: string; senderId: string;
    ciphertext: string; ephemeralKeyId?: number;
    messageType: string; createdAt: string; replyTo?: string;
}

type TypingEvent = { userId: string };
type ReadEvent = { messageId: string; readAt: string };
type ReactionEvent = { messageId: string; userId: string; emoji: string };

type MessageListener = (msg: IncomingMessage) => void;
type TypingListener = (event: TypingEvent) => void;

interface SocketState {
    socket: Socket | null;
    isConnected: boolean;
    connect: () => void;
    disconnect: () => void;
    sendMessage: (payload: {
        conversationId: string; receiverId: string; ciphertext: string;
        ephemeralKeyId?: number; messageType?: string; replyTo?: string; expiresAt?: string;
    }) => void;
    sendTypingStart: (receiverId: string) => void;
    sendTypingStop: (receiverId: string) => void;
    sendReadReceipt: (messageId: string, senderId: string) => void;
    sendReaction: (messageId: string, emoji: string, receiverId: string) => void;
    onMessage: (listener: MessageListener) => () => void;
    onTypingStart: (listener: TypingListener) => () => void;
    onTypingStop: (listener: TypingListener) => () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    isConnected: false,

    connect: () => {
        const { socket } = get();
        if (socket?.connected) return;

        const token = tokenStorage.getString('accessToken');
        if (!token) return;

        const newSocket = io('http://10.0.2.2:3000/chat', {
            auth: { token },
            transports: ['websocket'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on('connect', () => {
            set({ isConnected: true });
            console.log('[Socket] Connected:', newSocket.id);
        });

        newSocket.on('disconnect', () => {
            set({ isConnected: false });
        });

        newSocket.on('connect_error', (err) => {
            console.warn('[Socket] Connection error:', err.message);
        });

        set({ socket: newSocket });
    },

    disconnect: () => {
        const { socket } = get();
        socket?.disconnect();
        set({ socket: null, isConnected: false });
    },

    sendMessage: (payload) => {
        get().socket?.emit('message:send', payload);
    },

    sendTypingStart: (receiverId) => {
        get().socket?.emit('typing:start', { receiverId });
    },

    sendTypingStop: (receiverId) => {
        get().socket?.emit('typing:stop', { receiverId });
    },

    sendReadReceipt: (messageId, senderId) => {
        get().socket?.emit('message:read', { messageId, senderId });
    },

    sendReaction: (messageId, emoji, receiverId) => {
        get().socket?.emit('message:react', { messageId, emoji, receiverId });
    },

    onMessage: (listener: MessageListener) => {
        const { socket } = get();
        if (!socket) return () => { };
        socket.on('message:received', listener);
        return () => socket.off('message:received', listener);
    },

    onTypingStart: (listener: TypingListener) => {
        const { socket } = get();
        if (!socket) return () => { };
        socket.on('typing:start', listener);
        return () => socket.off('typing:start', listener);
    },

    onTypingStop: (listener: TypingListener) => {
        const { socket } = get();
        if (!socket) return () => { };
        socket.on('typing:stop', listener);
        return () => socket.off('typing:stop', listener);
    },
}));
