import { type PropsWithChildren } from 'react';
import { View } from 'react-native';

interface RowProps extends PropsWithChildren {
  className?: string;
  gap?: number;
}

export function Row({ children, className = '', gap = 8 }: RowProps) {
  return (
    <View className={`flex-row items-center ${className}`} style={{ gap }}>
      {children}
    </View>
  );
}
