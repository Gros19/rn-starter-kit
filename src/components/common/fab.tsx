import { Pressable } from 'react-native';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';

interface FABProps {
  icon: LucideIcon;
  onPress: () => void;
  className?: string;
  testID?: string;
}

export function FAB({ icon: Icon, onPress, className, testID }: FABProps) {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      className={cn(
        'absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg shadow-black/25 active:bg-primary/90',
        className,
      )}
    >
      <Icon size={24} className="text-primary-foreground" />
    </Pressable>
  );
}
