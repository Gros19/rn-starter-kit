import { View, ActivityIndicator, Text, Modal } from 'react-native';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/40">
        <View className="bg-white dark:bg-neutral-800 rounded-2xl p-6 items-center min-w-[120px]">
          <ActivityIndicator size="large" color="#0a7ea4" />
          {message && (
            <Text className="text-sm text-neutral-600 dark:text-neutral-300 mt-3">
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
