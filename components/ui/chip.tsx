import { Pressable, Text } from 'react-native';
import { X } from 'lucide-react-native';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function Chip({ label, selected = false, onPress, onRemove, className = '' }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center self-start rounded-full px-3 py-1.5 ${
        selected
          ? 'bg-primary-500'
          : 'bg-neutral-100 dark:bg-neutral-800'
      } ${className}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text
        className={`text-sm font-medium ${
          selected ? 'text-white' : 'text-neutral-700 dark:text-neutral-300'
        }`}
      >
        {label}
      </Text>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8} className="ml-1">
          <X size={14} color={selected ? '#fff' : '#737373'} />
        </Pressable>
      )}
    </Pressable>
  );
}
