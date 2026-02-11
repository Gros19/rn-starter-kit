import { type PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaProps extends PropsWithChildren {
  className?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function SafeArea({ children, className = '', edges = ['top', 'bottom'] }: SafeAreaProps) {
  const insets = useSafeAreaInsets();

  const paddingStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  return (
    <View className={`flex-1 bg-white dark:bg-neutral-950 ${className}`} style={paddingStyle}>
      {children}
    </View>
  );
}
