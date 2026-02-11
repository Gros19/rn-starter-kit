import { useEffect, useCallback } from 'react';
import { FlatList, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeArea } from '@/components/layout';
import { Header } from '@/components/composite';
import { MessageBubble } from '@/components/chat/message-bubble';
import { ChatInput } from '@/components/chat/chat-input';
import { useChatStore } from '@/lib/stores/chat-store';
import { ConditionalAdBanner } from '@/components/ads/conditional-ad-banner';

export default function ChatRoomScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { messages, enterRoom, leaveRoom, sendMessage, markAsRead, rooms } = useChatStore();

  const roomMessages = messages[roomId ?? ''] ?? [];
  const room = rooms.find((r) => r.id === roomId);

  useEffect(() => {
    if (roomId) {
      enterRoom(roomId);
      markAsRead(roomId);
    }
    return () => leaveRoom();
  }, [roomId, enterRoom, leaveRoom, markAsRead]);

  const handleSend = useCallback(
    (text: string) => {
      if (roomId) sendMessage(roomId, text, 'text');
    },
    [roomId, sendMessage],
  );

  return (
    <SafeArea edges={['top']}>
      <Header title={room?.name ?? '채팅'} showBack />
      <FlatList
        data={roomMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble message={item} isMe={item.senderId === 'me'} />
        )}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        inverted={false}
      />
      <ConditionalAdBanner placement="chat_interstitial" />
      <ChatInput onSend={handleSend} />
    </SafeArea>
  );
}
