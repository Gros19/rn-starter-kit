import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

export function Header({
  title,
  showBack = false,
  rightAction,
  transparent = false,
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className={`flex-row items-center px-4 pb-2 ${transparent ? '' : 'bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800'}`}
      style={{ paddingTop: insets.top + 8 }}
    >
      <View className="w-10">
        {showBack && (
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기"
          >
            <ChevronLeft size={24} color="#737373" />
          </Pressable>
        )}
      </View>
      <Text
        className="flex-1 text-center text-lg font-semibold text-neutral-900 dark:text-neutral-100"
        numberOfLines={1}
      >
        {title}
      </Text>
      <View className="w-10 items-end">{rightAction}</View>
    </View>
  );
}
