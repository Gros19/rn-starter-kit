import { View, Pressable } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { PriorityBadge } from './priority-badge';
import { Check, Circle, Clock, Trash2 } from 'lucide-react-native';
import type { Todo, TodoStatus } from '../types';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<TodoStatus, { icon: typeof Check; label: string }> = {
  todo: { icon: Circle, label: '할 일' },
  in_progress: { icon: Clock, label: '진행 중' },
  done: { icon: Check, label: '완료' },
};

const NEXT_STATUS: Record<TodoStatus, TodoStatus> = {
  todo: 'in_progress',
  in_progress: 'done',
  done: 'todo',
};

interface TodoItemProps {
  todo: Todo;
  onPress: () => void;
  onStatusToggle: (status: TodoStatus) => void;
  onDelete: () => void;
}

export function TodoItem({ todo, onPress, onStatusToggle, onDelete }: TodoItemProps) {
  const statusConfig = STATUS_CONFIG[todo.status];
  const StatusIcon = statusConfig.icon;

  return (
    <Pressable onPress={onPress}>
      <Card className={cn(todo.status === 'done' && 'opacity-60')}>
        <CardContent className="pt-0">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => onStatusToggle(NEXT_STATUS[todo.status])}
              className="p-1"
              hitSlop={8}
            >
              <StatusIcon
                size={22}
                className={cn(
                  todo.status === 'done' ? 'text-primary' : 'text-muted-foreground',
                )}
              />
            </Pressable>

            <View className="flex-1 gap-1">
              <Text
                className={cn(
                  'font-medium',
                  todo.status === 'done' && 'line-through text-muted-foreground',
                )}
              >
                {todo.title}
              </Text>
              {todo.description && (
                <Text variant="muted" numberOfLines={1}>{todo.description}</Text>
              )}
            </View>

            <PriorityBadge priority={todo.priority} />

            <Pressable onPress={onDelete} className="p-1" hitSlop={8}>
              <Trash2 size={18} className="text-muted-foreground" />
            </Pressable>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}
