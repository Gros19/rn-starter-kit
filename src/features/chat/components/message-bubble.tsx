import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <View
      className={cn(
        'max-w-[75%] mb-2',
        isUser ? 'self-end' : 'self-start',
      )}
    >
      <View
        className={cn(
          'px-4 py-2.5 rounded-2xl',
          isUser
            ? 'bg-primary rounded-br-sm'
            : 'bg-muted rounded-bl-sm',
        )}
      >
        <Text
          className={cn(
            'text-sm',
            isUser ? 'text-primary-foreground' : 'text-foreground',
          )}
        >
          {message.content}
        </Text>
      </View>
      <Text
        className={cn(
          'text-[10px] text-muted-foreground mt-1',
          isUser ? 'text-right' : 'text-left',
        )}
      >
        {formatTime(message.createdAt)}
      </Text>
    </View>
  );
}
