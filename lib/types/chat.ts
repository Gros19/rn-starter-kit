export type MessageType = 'text' | 'image' | 'voice' | 'file';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatRoom {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  participants: ChatParticipant[];
  isGroup: boolean;
}

export interface ChatParticipant {
  userId: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  type: MessageType;
  content: string;
  fileUrl?: string;
  fileName?: string;
  fileSizeBytes?: number;
  voiceDurationMs?: number;
  status: MessageStatus;
  createdAt: string;
  readBy: string[];
}

export interface TypingIndicator {
  roomId: string;
  userId: string;
  isTyping: boolean;
}
