import { View, Text } from 'react-native';

interface ProgressProps {
  value: number; // 0-100
  label?: string;
  showValue?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

const variantColors: Record<string, string> = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
};

export function Progress({
  value,
  label,
  showValue = false,
  variant = 'primary',
  size = 'md',
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <View>
      {(label || showValue) && (
        <View className="flex-row justify-between mb-1">
          {label && (
            <Text className="text-sm text-neutral-700 dark:text-neutral-300">{label}</Text>
          )}
          {showValue && (
            <Text className="text-sm text-neutral-500">{Math.round(clamped)}%</Text>
          )}
        </View>
      )}
      <View
        className={`bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: clamped }}
      >
        <View
          className={`h-full rounded-full ${variantColors[variant]}`}
          style={{ width: `${clamped}%` }}
        />
      </View>
    </View>
  );
}
