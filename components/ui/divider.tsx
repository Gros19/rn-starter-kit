import { View, Text } from 'react-native';

interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className = '' }: DividerProps) {
  if (label) {
    return (
      <View className={`flex-row items-center ${className}`}>
        <View className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
        <Text className="px-3 text-sm text-neutral-400">{label}</Text>
        <View className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
      </View>
    );
  }

  return <View className={`h-px bg-neutral-200 dark:bg-neutral-700 ${className}`} />;
}
