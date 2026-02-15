import { ActivityIndicator, View } from 'react-native';
import { Text } from '@/components/ui/text';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" className="text-primary" />
      {message && (
        <Text variant="muted" className="mt-3">
          {message}
        </Text>
      )}
    </View>
  );
}
