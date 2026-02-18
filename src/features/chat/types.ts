export type MessageSender = 'user' | 'bot';

export interface Message {
  id: string;
  roomId: string;
  content: string;
  sender: MessageSender;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  avatar: string; // 이니셜 또는 이모지
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}
