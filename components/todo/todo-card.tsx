import { Pressable, View, Text } from 'react-native';
import { Circle, CircleDot, CheckCircle2 } from 'lucide-react-native';
import type { Todo } from '@/lib/types/todo';
import { Badge } from '@/components/ui';

interface TodoCardProps {
  todo: Todo;
  onPress?: () => void;
  onStatusToggle?: () => void;
}

const priorityVariant = {
  low: 'default' as const,
  medium: 'warning' as const,
  high: 'error' as const,
};

const statusIcon = {
  todo: Circle,
  in_progress: CircleDot,
  done: CheckCircle2,
};

export function TodoCard({ todo, onPress, onStatusToggle }: TodoCardProps) {
  const StatusIcon = statusIcon[todo.status];
  const iconColor = todo.status === 'done' ? '#22C55E' : todo.status === 'in_progress' ? '#0a7ea4' : '#A3A3A3';

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-start bg-white dark:bg-neutral-900 rounded-xl p-3 border border-neutral-100 dark:border-neutral-800"
    >
      <Pressable onPress={onStatusToggle} hitSlop={8} className="mt-0.5 mr-3">
        <StatusIcon size={22} color={iconColor} />
      </Pressable>
      <View className="flex-1">
        <Text
          className={`text-base ${
            todo.status === 'done'
              ? 'text-neutral-400 line-through'
              : 'text-neutral-900 dark:text-neutral-100'
          }`}
          numberOfLines={2}
        >
          {todo.title}
        </Text>
        {todo.description && (
          <Text className="text-sm text-neutral-500 mt-0.5" numberOfLines={1}>
            {todo.description}
          </Text>
        )}
        <View className="flex-row gap-2 mt-2">
          <Badge label={todo.priority} variant={priorityVariant[todo.priority]} />
          {todo.dueDate && (
            <Badge label={new Date(todo.dueDate).toLocaleDateString('ko-KR')} variant="info" />
          )}
          {todo.subtasks && todo.subtasks.length > 0 && (
            <Badge
              label={`${todo.subtasks.filter((s) => s.status === 'done').length}/${todo.subtasks.length}`}
              variant="default"
            />
          )}
        </View>
      </View>
    </Pressable>
  );
}
