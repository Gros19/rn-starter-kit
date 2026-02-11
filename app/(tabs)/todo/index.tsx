import { useEffect, useState } from 'react';
import { FlatList, View, Text, Alert } from 'react-native';
import { Plus, ClipboardList } from 'lucide-react-native';
import { SafeArea } from '@/components/layout';
import { Button, Chip } from '@/components/ui';
import { SearchBar, EmptyState } from '@/components/composite';
import { TodoCard } from '@/components/todo/todo-card';
import { ConditionalAdBanner } from '@/components/ads/conditional-ad-banner';
import { FeatureGate } from '@/components/subscription/feature-gate';
import { useTodoStore } from '@/lib/stores/todo-store';
import type { TodoStatus } from '@/lib/types/todo';

const statusFilters: { key: TodoStatus | 'all'; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'todo', label: '할 일' },
  { key: 'in_progress', label: '진행 중' },
  { key: 'done', label: '완료' },
];

export default function TodoScreen() {
  const { loadTodos, getFilteredTodos, setFilter, filter, canAddTodo, moveTodo } = useTodoStore();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<TodoStatus | 'all'>('all');

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    setFilter({
      search: search || undefined,
      status: activeFilter === 'all' ? undefined : activeFilter,
    });
  }, [search, activeFilter, setFilter]);

  const todos = getFilteredTodos();

  const handleStatusToggle = (id: string, currentStatus: TodoStatus) => {
    const nextStatus: Record<TodoStatus, TodoStatus> = {
      todo: 'in_progress',
      in_progress: 'done',
      done: 'todo',
    };
    moveTodo(id, nextStatus[currentStatus]);
  };

  const handleAddTodo = () => {
    if (!canAddTodo()) {
      Alert.alert('제한', '무료 플랜에서는 최대 10개의 할 일만 추가할 수 있습니다.');
      return;
    }
    // TODO: Todo 생성 모달/화면으로 이동
  };

  return (
    <SafeArea edges={['top']}>
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            할 일
          </Text>
          <Button
            title="추가"
            size="sm"
            icon={<Plus size={16} color="#fff" />}
            onPress={handleAddTodo}
          />
        </View>
        <SearchBar value={search} onChangeText={setSearch} placeholder="할 일 검색" />
        <View className="flex-row gap-2 mt-3">
          {statusFilters.map((f) => (
            <Chip
              key={f.key}
              label={f.label}
              selected={activeFilter === f.key}
              onPress={() => setActiveFilter(f.key)}
            />
          ))}
        </View>
      </View>

      <ConditionalAdBanner placement="home_banner" />

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 8, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            icon={<ClipboardList size={48} color="#A3A3A3" />}
            title="할 일이 없습니다"
            description="새로운 할 일을 추가해보세요"
            actionTitle="추가하기"
            onAction={handleAddTodo}
          />
        }
        renderItem={({ item }) => (
          <TodoCard
            todo={item}
            onStatusToggle={() => handleStatusToggle(item.id, item.status)}
          />
        )}
      />
    </SafeArea>
  );
}
