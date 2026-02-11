import { create } from 'zustand';
import type { ChatMessage, ChatRoom, TypingIndicator } from '@/lib/types/chat';
import { api } from '@/lib/api/client';
import { setChatRoomState } from '@/lib/ads/ad-condition-engine';

interface ChatState {
  rooms: ChatRoom[];
  currentRoomId: string | null;
  messages: Record<string, ChatMessage[]>; // roomId -> messages
  typingUsers: Record<string, string[]>; // roomId -> userIds
  isLoading: boolean;

  loadRooms: () => Promise<void>;
  loadMessages: (roomId: string) => Promise<void>;
  sendMessage: (roomId: string, content: string, type: ChatMessage['type']) => Promise<void>;
  enterRoom: (roomId: string) => void;
  leaveRoom: () => void;
  handleTyping: (indicator: TypingIndicator) => void;
  handleNewMessage: (message: ChatMessage) => void;
  markAsRead: (roomId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  rooms: [],
  currentRoomId: null,
  messages: {},
  typingUsers: {},
  isLoading: false,

  loadRooms: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<ChatRoom[]>('/chat/rooms');
      if (data) set({ rooms: data });
    } finally {
      set({ isLoading: false });
    }
  },

  loadMessages: async (roomId) => {
    const { data } = await api.get<ChatMessage[]>(`/chat/rooms/${roomId}/messages`);
    if (data) {
      set((state) => ({
        messages: { ...state.messages, [roomId]: data },
      }));
    }
  },

  sendMessage: async (roomId, content, type) => {
    const tempId = `temp_${Date.now()}`;
    const tempMessage: ChatMessage = {
      id: tempId,
      roomId,
      senderId: 'me', // auth store에서 가져와야 함
      type,
      content,
      status: 'sending',
      createdAt: new Date().toISOString(),
      readBy: [],
    };

    // 낙관적 업데이트
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] ?? []), tempMessage],
      },
    }));

    try {
      const { data, error } = await api.post<ChatMessage>(`/chat/rooms/${roomId}/messages`, {
        content,
        type,
      });

      if (error) throw new Error(error);

      // 실제 메시지로 교체
      set((state) => ({
        messages: {
          ...state.messages,
          [roomId]: (state.messages[roomId] ?? []).map((m) =>
            m.id === tempId ? (data ?? { ...m, status: 'sent' as const }) : m,
          ),
        },
      }));
    } catch {
      // 실패 표시
      set((state) => ({
        messages: {
          ...state.messages,
          [roomId]: (state.messages[roomId] ?? []).map((m) =>
            m.id === tempId ? { ...m, status: 'failed' as const } : m,
          ),
        },
      }));
    }
  },

  enterRoom: (roomId) => {
    set({ currentRoomId: roomId });
    setChatRoomState(true); // 광고 엔진에 알림
    get().loadMessages(roomId);
  },

  leaveRoom: () => {
    set({ currentRoomId: null });
    setChatRoomState(false); // 광고 엔진에 알림
  },

  handleTyping: (indicator) => {
    set((state) => {
      const current = state.typingUsers[indicator.roomId] ?? [];
      const updated = indicator.isTyping
        ? [...new Set([...current, indicator.userId])]
        : current.filter((id) => id !== indicator.userId);
      return {
        typingUsers: { ...state.typingUsers, [indicator.roomId]: updated },
      };
    });
  },

  handleNewMessage: (message) => {
    set((state) => {
      const roomMessages = state.messages[message.roomId] ?? [];
      // 중복 방지
      if (roomMessages.some((m) => m.id === message.id)) return state;
      return {
        messages: {
          ...state.messages,
          [message.roomId]: [...roomMessages, message],
        },
        rooms: state.rooms.map((r) =>
          r.id === message.roomId
            ? {
                ...r,
                lastMessage: message.content,
                lastMessageAt: message.createdAt,
                unreadCount: state.currentRoomId === message.roomId ? r.unreadCount : r.unreadCount + 1,
              }
            : r,
        ),
      };
    });
  },

  markAsRead: async (roomId) => {
    await api.post(`/chat/rooms/${roomId}/read`);
    set((state) => ({
      rooms: state.rooms.map((r) => (r.id === roomId ? { ...r, unreadCount: 0 } : r)),
    }));
  },
}));
