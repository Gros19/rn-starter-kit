import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      {Icon && (
        <View className="bg-muted rounded-full p-4 mb-4">
          <Icon size={32} className="text-muted-foreground" />
        </View>
      )}
      <Text className="text-lg font-semibold text-center mb-1">{title}</Text>
      {message && <Text variant="muted" className="text-center mb-4">{message}</Text>}
      {actionLabel && onAction && (
        <Button onPress={onAction}>
          <Text>{actionLabel}</Text>
        </Button>
      )}
    </View>
  );
}
