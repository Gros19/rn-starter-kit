import { View, TextInput, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = '검색',
  autoFocus = false,
  className = '',
}: SearchBarProps) {
  return (
    <View
      className={`flex-row items-center bg-neutral-100 dark:bg-neutral-800 rounded-xl px-3 py-2.5 ${className}`}
    >
      <Search size={18} color="#A3A3A3" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A3A3A3"
        className="flex-1 ml-2 text-base text-neutral-900 dark:text-neutral-100"
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <X size={18} color="#A3A3A3" />
        </Pressable>
      )}
    </View>
  );
}
