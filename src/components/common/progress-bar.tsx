import { View } from 'react-native';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));
  return (
    <View className={cn('h-2 w-full bg-secondary rounded-full overflow-hidden', className)}>
      <View
        className="h-full bg-primary rounded-full"
        style={{ width: `${clamped}%` }}
      />
    </View>
  );
}
