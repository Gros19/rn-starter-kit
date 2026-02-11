import { View, Text } from 'react-native';
import { Image } from 'expo-image';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, { container: string; text: string; px: number }> = {
  xs: { container: 'w-6 h-6', text: 'text-xs', px: 24 },
  sm: { container: 'w-8 h-8', text: 'text-sm', px: 32 },
  md: { container: 'w-10 h-10', text: 'text-base', px: 40 },
  lg: { container: 'w-14 h-14', text: 'text-lg', px: 56 },
  xl: { container: 'w-20 h-20', text: 'text-2xl', px: 80 },
};

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ uri, name, size = 'md', className = '' }: AvatarProps) {
  const s = sizeMap[size];

  if (uri) {
    return (
      <Image
        source={{ uri }}
        className={`${s.container} rounded-full ${className}`}
        style={{ width: s.px, height: s.px, borderRadius: s.px / 2 }}
        contentFit="cover"
        transition={200}
      />
    );
  }

  return (
    <View
      className={`${s.container} rounded-full bg-primary-100 dark:bg-primary-800 items-center justify-center ${className}`}
    >
      <Text className={`${s.text} font-semibold text-primary-700 dark:text-primary-200`}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
