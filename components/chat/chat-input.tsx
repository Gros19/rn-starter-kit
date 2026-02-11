import { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Send, Plus } from 'lucide-react-native';

interface ChatInputProps {
  onSend: (text: string) => void;
  onAttach?: () => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, onAttach, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <View className="flex-row items-end px-3 py-2 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      {onAttach && (
        <Pressable
          onPress={onAttach}
          className="w-10 h-10 items-center justify-center"
          accessibilityLabel="첨부"
        >
          <Plus size={22} color="#737373" />
        </Pressable>
      )}
      <View className="flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-4 py-2.5 mx-2 max-h-[120px]">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="메시지 입력..."
          placeholderTextColor="#A3A3A3"
          className="text-base text-neutral-900 dark:text-neutral-100"
          multiline
          editable={!disabled}
          returnKeyType="send"
          blurOnSubmit
          onSubmitEditing={handleSend}
        />
      </View>
      <Pressable
        onPress={handleSend}
        disabled={!text.trim() || disabled}
        className={`w-10 h-10 rounded-full items-center justify-center ${
          text.trim() ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-700'
        }`}
        accessibilityLabel="전송"
      >
        <Send size={18} color={text.trim() ? '#fff' : '#A3A3A3'} />
      </Pressable>
    </View>
  );
}
