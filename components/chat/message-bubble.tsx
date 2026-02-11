import { View, Text } from 'react-native';
import type { ChatMessage } from '@/lib/types/chat';
import { Check, CheckCheck } from 'lucide-react-native';

interface MessageBubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

export function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View className={`flex-row mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <View
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isMe
            ? 'bg-primary-500 rounded-br-sm'
            : 'bg-neutral-100 dark:bg-neutral-800 rounded-bl-sm'
        }`}
      >
        <Text
          className={`text-base ${isMe ? 'text-white' : 'text-neutral-900 dark:text-neutral-100'}`}
        >
          {message.content}
        </Text>
        <View className={`flex-row items-center mt-1 ${isMe ? 'justify-end' : ''}`}>
          <Text
            className={`text-xs ${isMe ? 'text-white/70' : 'text-neutral-400'}`}
          >
            {time}
          </Text>
          {isMe && (
            <View className="ml-1">
              {message.status === 'read' ? (
                <CheckCheck size={14} color="#fff" />
              ) : message.status === 'sent' || message.status === 'delivered' ? (
                <Check size={14} color="rgba(255,255,255,0.7)" />
              ) : null}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
