import { Pressable, View, Text, type PressableProps } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  onPress?: PressableProps['onPress'];
  destructive?: boolean;
}

export function ListItem({
  title,
  subtitle,
  leftIcon,
  rightElement,
  showChevron = false,
  onPress,
  destructive = false,
}: ListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3 active:bg-neutral-50 dark:active:bg-neutral-800"
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
    >
      {leftIcon && <View className="mr-3">{leftIcon}</View>}
      <View className="flex-1">
        <Text
          className={`text-base ${
            destructive
              ? 'text-error-500'
              : 'text-neutral-900 dark:text-neutral-100'
          }`}
        >
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement && <View className="ml-2">{rightElement}</View>}
      {showChevron && <ChevronRight size={18} color="#A3A3A3" className="ml-1" />}
    </Pressable>
  );
}
