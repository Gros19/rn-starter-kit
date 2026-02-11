import { type PropsWithChildren } from 'react';
import { View } from 'react-native';

interface ContainerProps extends PropsWithChildren {
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <View className={`flex-1 px-4 bg-white dark:bg-neutral-950 ${className}`}>
      {children}
    </View>
  );
}
