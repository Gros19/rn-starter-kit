import { View, TextInput, Pressable } from 'react-native';
import { Send } from 'lucide-react-native';
import { useState } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <View className="flex-row items-center gap-2 p-3 border-t border-border bg-background">
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="메시지를 입력하세요..."
        className="flex-1 bg-muted rounded-full px-4 py-2 text-sm text-foreground"
        placeholderTextColor="#9ca3af"
        onSubmitEditing={handleSend}
        returnKeyType="send"
      />
      <Pressable
        onPress={handleSend}
        disabled={!text.trim()}
        className="w-10 h-10 rounded-full bg-primary items-center justify-center active:bg-primary/90 disabled:opacity-50"
      >
        <Send size={18} className="text-primary-foreground" />
      </Pressable>
    </View>
  );
}
