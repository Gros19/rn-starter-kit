import { View, Text, Pressable, Modal as RNModal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ActionSheetAction {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  icon?: React.ReactNode;
}

interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  actions: ActionSheetAction[];
}

export function ActionSheet({ visible, onClose, title, actions }: ActionSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <RNModal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={onClose}>
        <Pressable
          className="bg-white dark:bg-neutral-900 rounded-t-3xl"
          style={{ paddingBottom: insets.bottom + 16 }}
          onPress={(e) => e.stopPropagation()}
        >
          {title && (
            <Text className="text-center text-sm text-neutral-500 py-3 border-b border-neutral-100 dark:border-neutral-800">
              {title}
            </Text>
          )}
          <View className="pt-2">
            {actions.map((action, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  action.onPress();
                  onClose();
                }}
                className="px-6 py-4 active:bg-neutral-50 dark:active:bg-neutral-800 flex-row items-center"
              >
                {action.icon && <View className="mr-3">{action.icon}</View>}
                <Text
                  className={`text-base ${
                    action.destructive
                      ? 'text-error-500'
                      : 'text-neutral-900 dark:text-neutral-100'
                  }`}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <View className="px-4 pt-2">
            <Pressable
              onPress={onClose}
              className="bg-neutral-100 dark:bg-neutral-800 rounded-xl py-3"
            >
              <Text className="text-center text-base font-semibold text-neutral-900 dark:text-neutral-100">
                취소
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
