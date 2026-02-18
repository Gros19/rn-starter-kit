import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import type { TodoPriority } from '../types';

const PRIORITY_CONFIG: Record<TodoPriority, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  high: { label: '높음', variant: 'destructive' },
  medium: { label: '보통', variant: 'default' },
  low: { label: '낮음', variant: 'secondary' },
};

interface PriorityBadgeProps {
  priority: TodoPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <Badge variant={config.variant}>
      <Text>{config.label}</Text>
    </Badge>
  );
}
