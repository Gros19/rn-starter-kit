import { Pressable } from 'react-native';
import { Heart } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onPress: () => void;
  isLoading?: boolean;
  size?: number;
  className?: string;
}

export function LikeButton({ liked, count, onPress, isLoading, size = 18, className }: LikeButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      className={cn('flex-row items-center gap-1 active:opacity-70', className)}
    >
      <Heart
        size={size}
        className={liked ? 'text-red-500' : 'text-muted-foreground'}
        fill={liked ? '#ef4444' : 'transparent'}
      />
      {count > 0 && (
        <Text className="text-xs text-muted-foreground">{count}</Text>
      )}
    </Pressable>
  );
}
