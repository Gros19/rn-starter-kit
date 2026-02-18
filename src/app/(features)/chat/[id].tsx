import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useRef, useEffect, useCallback } from 'react';
import { MessageBubble } from '@/features/chat/components/message-bubble';
import { TypingIndicator } from '@/features/chat/components/typing-indicator';
import { ChatInput } from '@/features/chat/components/chat-input';
import { useChatStore, triggerEchoBot } from '@/features/chat/store';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const flatListRef = useRef<FlatList>(null);

  const room = useChatStore((s) => s.rooms.find((r) => r.id === id));
  const messages = useChatStore((s) => s.messages[id] ?? []);
  const isTyping = useChatStore((s) => s.isTyping[id] ?? false);
  const sendMessage = useChatStore((s) => s.sendMessage);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages.length, isTyping, scrollToEnd]);

  const handleSend = (text: string) => {
    sendMessage(id, text);
    triggerEchoBot(id);
  };

  return (
    <>
      <Stack.Screen options={{ title: room?.name ?? '채팅' }} />
      <KeyboardAvoidingView
        className="flex-1 bg-background"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pt-4 pb-2"
          renderItem={({ item }) => <MessageBubble message={item} />}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          onContentSizeChange={scrollToEnd}
        />
        <ChatInput onSend={handleSend} />
      </KeyboardAvoidingView>
    </>
  );
}
