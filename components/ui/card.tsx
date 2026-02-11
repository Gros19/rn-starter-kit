import { type PropsWithChildren } from 'react';
import { Pressable, View, type PressableProps } from 'react-native';

interface CardProps extends PropsWithChildren {
  className?: string;
  onPress?: PressableProps['onPress'];
}

export function Card({ children, className = '', onPress }: CardProps) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      className={`bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-800 ${className}`}
      {...(onPress && { accessibilityRole: 'button' as const })}
    >
      {children}
    </Wrapper>
  );
}
