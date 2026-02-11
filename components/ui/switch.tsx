import { Switch as RNSwitch, View, Text, type SwitchProps as RNSwitchProps } from 'react-native';

interface SwitchProps extends Omit<RNSwitchProps, 'value' | 'onValueChange'> {
  label?: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function Switch({ label, description, value, onValueChange, ...props }: SwitchProps) {
  return (
    <View className="flex-row items-center justify-between">
      {(label || description) && (
        <View className="flex-1 mr-3">
          {label && (
            <Text className="text-base font-medium text-neutral-900 dark:text-neutral-100">
              {label}
            </Text>
          )}
          {description && (
            <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              {description}
            </Text>
          )}
        </View>
      )}
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D4D4D4', true: '#0a7ea4' }}
        thumbColor="#fff"
        accessibilityRole="switch"
        accessibilityLabel={label}
        {...props}
      />
    </View>
  );
}
