import { View, Text } from 'react-native';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantClasses: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: 'bg-neutral-100 dark:bg-neutral-800', text: 'text-neutral-700 dark:text-neutral-300' },
  primary: { bg: 'bg-primary-50 dark:bg-primary-900', text: 'text-primary-700 dark:text-primary-300' },
  success: { bg: 'bg-success-50', text: 'text-success-700' },
  warning: { bg: 'bg-warning-50', text: 'text-warning-700' },
  error: { bg: 'bg-error-50', text: 'text-error-700' },
  info: { bg: 'bg-info-50', text: 'text-info-700' },
};

export function Badge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  const v = variantClasses[variant];
  return (
    <View
      className={`self-start rounded-full ${v.bg} ${size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1'}`}
    >
      <Text className={`font-medium ${v.text} ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        {label}
      </Text>
    </View>
  );
}
