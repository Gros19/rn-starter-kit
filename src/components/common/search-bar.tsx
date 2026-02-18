import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Pressable } from 'react-native';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = '검색...',
  debounceMs = 300,
  className,
}: SearchBarProps) {
  const [local, setLocal] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const handleChange = useCallback(
    (text: string) => {
      setLocal(text);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChangeText(text), debounceMs);
    },
    [onChangeText, debounceMs],
  );

  const handleClear = useCallback(() => {
    setLocal('');
    onChangeText('');
  }, [onChangeText]);

  return (
    <View className={cn('flex-row items-center gap-2', className)}>
      <View className="flex-1 relative justify-center">
        <View className="absolute left-3 z-10">
          <Search size={16} className="text-muted-foreground" />
        </View>
        <Input
          value={local}
          onChangeText={handleChange}
          placeholder={placeholder}
          className="pl-9 pr-9"
        />
        {local.length > 0 && (
          <Pressable onPress={handleClear} className="absolute right-3 z-10">
            <X size={16} className="text-muted-foreground" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
