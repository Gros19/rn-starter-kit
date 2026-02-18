import { View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeArea } from '@/components/layout';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PriorityBadge } from '@/features/todo/components/priority-badge';
import { TodoForm } from '@/features/todo/components/todo-form';
import { useTodo, useUpdateTodo, useDeleteTodo } from '@/features/todo/hooks/use-todos';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import type { CreateTodoPayload, TodoStatus } from '@/features/todo/types';
import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';

const STATUS_LABELS: Record<TodoStatus, string> = {
  todo: '할 일',
  in_progress: '진행 중',
  done: '완료',
};

export default function TodoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: todo, isLoading } = useTodo(id);
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleUpdate = (data: CreateTodoPayload) => {
    updateTodo.mutate(
      { id, ...data },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  if (isLoading) {
    return (
      <SafeArea edges={['top']}>
        <View className="px-4 pt-4 gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </View>
      </SafeArea>
    );
  }

  if (!todo) {
    return (
      <SafeArea edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <Text variant="muted">할 일을 찾을 수 없습니다</Text>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea edges={['top']}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8">
        {isEditing ? (
          <View className="pt-4">
            <TodoForm
              initialData={todo}
              onSubmit={handleUpdate}
              isLoading={updateTodo.isPending}
            />
            <Button
              variant="ghost"
              onPress={() => setIsEditing(false)}
              className="mt-2"
            >
              <Text>취소</Text>
            </Button>
          </View>
        ) : (
          <>
            <Card className="mt-4">
              <CardHeader>
                <View className="flex-row items-center justify-between">
                  <CardTitle className="flex-1">{todo.title}</CardTitle>
                  <PriorityBadge priority={todo.priority} />
                </View>
              </CardHeader>
              <CardContent>
                <View className="gap-3">
                  <View className="flex-row items-center gap-2">
                    <Text variant="muted">상태:</Text>
                    <Text className="font-medium">{STATUS_LABELS[todo.status]}</Text>
                  </View>
                  {todo.description && (
                    <View>
                      <Text variant="muted">설명:</Text>
                      <Text className="mt-1">{todo.description}</Text>
                    </View>
                  )}
                  <View>
                    <Text variant="muted">
                      생성: {new Date(todo.createdAt).toLocaleDateString('ko-KR')}
                    </Text>
                    <Text variant="muted">
                      수정: {new Date(todo.updatedAt).toLocaleDateString('ko-KR')}
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            <View className="flex-row gap-3 mt-4">
              <Button variant="outline" onPress={() => setIsEditing(true)} className="flex-1">
                <Text>수정</Text>
              </Button>
              <Button variant="destructive" onPress={() => setShowDeleteDialog(true)} className="flex-1">
                <Trash2 size={16} color="#fff" />
                <Text>삭제</Text>
              </Button>
            </View>
          </>
        )}

        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="할 일 삭제"
          description="이 할 일을 삭제하시겠습니까?"
          variant="destructive"
          confirmLabel="삭제"
          onConfirm={() => {
            deleteTodo.mutate(id, {
              onSuccess: () => router.back(),
            });
          }}
        />
      </ScrollView>
    </SafeArea>
  );
}
