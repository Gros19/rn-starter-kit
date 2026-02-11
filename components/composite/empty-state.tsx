import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionTitle, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      {icon && <View className="mb-4">{icon}</View>}
      <Text className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 text-center mb-1">
        {title}
      </Text>
      {description && (
        <Text className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-6">
          {description}
        </Text>
      )}
      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} size="md" />
      )}
    </View>
  );
}
