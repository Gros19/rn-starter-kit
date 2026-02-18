import { create } from 'zustand';
import type { Message, ChatRoom } from './types';

const MOCK_ROOMS: ChatRoom[] = [
  { id: 'r1', name: '김개발', avatar: '🧑‍💻', lastMessage: '네, 확인했습니다!', lastMessageAt: '2026-02-17T15:30:00Z', unreadCount: 2 },
  { id: 'r2', name: '이디자인', avatar: '🎨', lastMessage: 'UI 수정 완료했어요', lastMessageAt: '2026-02-17T14:00:00Z', unreadCount: 0 },
  { id: 'r3', name: '박매니저', avatar: '📋', lastMessage: '내일 회의 가능하세요?', lastMessageAt: '2026-02-17T10:00:00Z', unreadCount: 1 },
  { id: 'r4', name: '팀 채널', avatar: '👥', lastMessage: '스프린트 리뷰 시작합니다', lastMessageAt: '2026-02-16T18:00:00Z', unreadCount: 5 },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  r1: [
    { id: 'm1', roomId: 'r1', content: '안녕하세요! 스타터킷 관련 질문이 있습니다.', sender: 'bot', createdAt: '2026-02-17T15:00:00Z' },
    { id: 'm2', roomId: 'r1', content: '네, 말씀하세요!', sender: 'user', createdAt: '2026-02-17T15:10:00Z' },
    { id: 'm3', roomId: 'r1', content: '네, 확인했습니다!', sender: 'bot', createdAt: '2026-02-17T15:30:00Z' },
  ],
  r2: [
    { id: 'm4', roomId: 'r2', content: 'UI 수정 완료했어요', sender: 'bot', createdAt: '2026-02-17T14:00:00Z' },
  ],
  r3: [
    { id: 'm5', roomId: 'r3', content: '내일 회의 가능하세요?', sender: 'bot', createdAt: '2026-02-17T10:00:00Z' },
  ],
  r4: [
    { id: 'm6', roomId: 'r4', content: '스프린트 리뷰 시작합니다', sender: 'bot', createdAt: '2026-02-16T18:00:00Z' },
  ],
};

const BOT_REPLIES = [
  '네, 알겠습니다! 👍',
  '좋은 아이디어네요!',
  '확인해볼게요.',
  '감사합니다!',
  '잠시만요, 확인 중입니다...',
  '동의합니다! 진행하시죠.',
  '오, 그렇군요! 재미있네요.',
  '알겠습니다. 다음에 이야기해요!',
];

let nextMessageId = 100;

interface ChatState {
  rooms: ChatRoom[];
  messages: Record<string, Message[]>;
  isTyping: Record<string, boolean>;
  getRooms: () => ChatRoom[];
  getMessages: (roomId: string) => Message[];
  sendMessage: (roomId: string, content: string) => void;
  setTyping: (roomId: string, typing: boolean) => void;
  clearRoom: (roomId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  rooms: MOCK_ROOMS,
  messages: INITIAL_MESSAGES,
  isTyping: {},

  getRooms: () => get().rooms,

  getMessages: (roomId: string) => get().messages[roomId] ?? [],

  sendMessage: (roomId: string, content: string) => {
    const message: Message = {
      id: `m${nextMessageId++}`,
      roomId,
      content,
      sender: 'user',
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] ?? []), message],
      },
      rooms: state.rooms.map((r) =>
        r.id === roomId
          ? { ...r, lastMessage: content, lastMessageAt: message.createdAt, unreadCount: 0 }
          : r,
      ),
    }));
  },

  setTyping: (roomId: string, typing: boolean) => {
    set((state) => ({
      isTyping: { ...state.isTyping, [roomId]: typing },
    }));
  },

  clearRoom: (roomId: string) => {
    set((state) => ({
      messages: { ...state.messages, [roomId]: [] },
    }));
  },
}));

// Echo bot 로직
export function triggerEchoBot(roomId: string) {
  const store = useChatStore.getState();

  // 1.2초 후 타이핑 시작
  setTimeout(() => {
    store.setTyping(roomId, true);

    // 0.8초 후 응답
    setTimeout(() => {
      store.setTyping(roomId, false);
      const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
      const message: Message = {
        id: `m${nextMessageId++}`,
        roomId,
        content: reply,
        sender: 'bot',
        createdAt: new Date().toISOString(),
      };

      useChatStore.setState((state) => ({
        messages: {
          ...state.messages,
          [roomId]: [...(state.messages[roomId] ?? []), message],
        },
        rooms: state.rooms.map((r) =>
          r.id === roomId
            ? { ...r, lastMessage: reply, lastMessageAt: message.createdAt }
            : r,
        ),
      }));
    }, 800);
  }, 1200);
}
