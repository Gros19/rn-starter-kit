import { FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeArea } from '@/components/layout';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchBar } from '@/components/common/search-bar';
import { FilterChips } from '@/components/common/filter-chips';
import { EmptyState } from '@/components/common/empty-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { FAB } from '@/components/common/fab';
import { UpgradePrompt } from '@/features/subscription/components/upgrade-prompt';
import { TodoItem } from '@/features/todo/components/todo-item';
import { TodoForm } from '@/features/todo/components/todo-form';
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from '@/features/todo/hooks/use-todos';
import { useTodoFilters } from '@/features/todo/hooks/use-todo-filters';
import { useSubscriptionStore } from '@/features/subscription/store';
import { getTodoCount } from '@/features/todo/mock';
import type { TodoStatus, CreateTodoPayload } from '@/features/todo/types';
import { Plus, ListTodo } from 'lucide-react-native';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { TestIds } from '@/lib/utils/testIds';

const STATUS_CHIPS: { label: string; value: TodoStatus }[] = [
  { label: '할 일', value: 'todo' },
  { label: '진행 중', value: 'in_progress' },
  { label: '완료', value: 'done' },
];

export default function TodoListScreen() {
  const router = useRouter();
  const { filter, setStatus, setSearch } = useTodoFilters();
  const { data: todos, isLoading } = useTodos(filter);
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const canCreateTodo = useSubscriptionStore((s) => s.canUse)('unlimited_todos');
  const incrementUsage = useSubscriptionStore((s) => s.incrementUsage);

  const handleCreate = (data: CreateTodoPayload) => {
    createTodo.mutate(data, {
      onSuccess: () => {
        incrementUsage('unlimited_todos');
        setShowCreateDialog(false);
      },
    });
  };

  const handleStatusToggle = (id: string, status: TodoStatus) => {
    updateTodo.mutate({ id, status });
  };

  return (
    <SafeArea edges={['top']}>
      <View className="flex-1" testID={TestIds.todo.screen}>
        <View className="px-4 pt-2 gap-3">
          <SearchBar
            value={filter.search ?? ''}
            onChangeText={setSearch}
            placeholder="할 일 검색..."
          />
          <FilterChips
            chips={STATUS_CHIPS}
            selected={filter.status}
            onSelect={setStatus}
          />
        </View>

        {isLoading ? (
          <View className="px-4 pt-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </View>
        ) : !todos?.length ? (
          <EmptyState
            icon={ListTodo}
            title="할 일이 없습니다"
            message="새로운 할 일을 추가해보세요"
            actionLabel="할 일 추가"
            onAction={() => setShowCreateDialog(true)}
          />
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            contentContainerClassName="px-4 pt-4 pb-24 gap-3"
            renderItem={({ item }) => (
              <TodoItem
                todo={item}
                onPress={() => router.push(`/(features)/todo/${item.id}` as never)}
                onStatusToggle={(status) => handleStatusToggle(item.id, status)}
                onDelete={() => setDeleteTarget(item.id)}
              />
            )}
          />
        )}

        <FAB
          icon={Plus}
          onPress={() => setShowCreateDialog(true)}
          testID={TestIds.todo.addButton}
        />

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 할 일</DialogTitle>
            </DialogHeader>
            {!canCreateTodo && getTodoCount() >= 10 ? (
              <UpgradePrompt message="무료 플랜에서는 최대 10개까지 생성 가능합니다" />
            ) : (
              <TodoForm onSubmit={handleCreate} isLoading={createTodo.isPending} />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={() => setDeleteTarget(null)}
          title="할 일 삭제"
          description="이 할 일을 삭제하시겠습니까?"
          variant="destructive"
          confirmLabel="삭제"
          onConfirm={() => {
            if (deleteTarget) deleteTodo.mutate(deleteTarget);
          }}
        />
      </View>
    </SafeArea>
  );
}
