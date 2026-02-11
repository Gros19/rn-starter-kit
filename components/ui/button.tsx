import { forwardRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
  type ViewStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

const variantClasses: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary-500 active:bg-primary-600',
    text: 'text-white',
  },
  secondary: {
    container: 'bg-secondary-500 active:bg-secondary-600',
    text: 'text-white',
  },
  outline: {
    container: 'border border-primary-500 bg-transparent active:bg-primary-50',
    text: 'text-primary-500',
  },
  ghost: {
    container: 'bg-transparent active:bg-neutral-100 dark:active:bg-neutral-800',
    text: 'text-neutral-900 dark:text-neutral-100',
  },
  destructive: {
    container: 'bg-error-500 active:bg-error-700',
    text: 'text-white',
  },
};

const sizeClasses: Record<ButtonSize, { container: string; text: string }> = {
  sm: { container: 'px-3 py-1.5 rounded-lg', text: 'text-sm' },
  md: { container: 'px-5 py-3 rounded-xl', text: 'text-base' },
  lg: { container: 'px-6 py-4 rounded-2xl', text: 'text-lg' },
};

export const Button = forwardRef<React.ComponentRef<typeof Pressable>, ButtonProps>(
  function Button(
    {
      title,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      className = '',
      style,
      ...props
    },
    ref,
  ) {
    const v = variantClasses[variant];
    const s = sizeClasses[size];
    const isDisabled = disabled || loading;

    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        className={`flex-row items-center justify-center ${s.container} ${v.container} ${fullWidth ? 'w-full' : ''} ${isDisabled ? 'opacity-50' : ''} ${className}`}
        style={style as ViewStyle}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        {...props}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'outline' || variant === 'ghost' ? '#0a7ea4' : '#fff'}
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            <Text
              className={`font-semibold ${s.text} ${v.text} ${icon ? (iconPosition === 'left' ? 'ml-2' : 'mr-2') : ''}`}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </Pressable>
    );
  },
);
