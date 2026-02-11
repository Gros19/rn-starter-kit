import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Todo, TodoFilter, TodoStatus } from '@/lib/types/todo';
import { api } from '@/lib/api/client';
import { mmkvStorage } from '@/lib/utils/storage';
import { useSubscriptionStore } from '@/lib/stores/subscription-store';
import { FREE_TIER_LIMITS } from '@/lib/types/subscription';

interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
  isLoading: boolean;

  loadTodos: () => Promise<void>;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  moveTodo: (id: string, status: TodoStatus) => Promise<void>;
  setFilter: (filter: Partial<TodoFilter>) => void;

  /** 필터링된 todos */
  getFilteredTodos: () => Todo[];

  /** 무료 플랜 제한 확인 */
  canAddTodo: () => boolean;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: {},
      isLoading: false,

      loadTodos: async () => {
        set({ isLoading: true });
        try {
          const { data } = await api.get<Todo[]>('/todos');
          if (data) set({ todos: data });
        } finally {
          set({ isLoading: false });
        }
      },

      addTodo: async (todo) => {
        if (!get().canAddTodo()) {
          throw new Error('무료 플랜에서는 최대 10개의 할 일만 추가할 수 있습니다.');
        }

        set({ isLoading: true });
        try {
          const { data, error } = await api.post<Todo>('/todos', todo);
          if (error || !data) throw new Error(error ?? 'Todo 추가 실패');
          set((s) => ({ todos: [...s.todos, data] }));
        } finally {
          set({ isLoading: false });
        }
      },

      updateTodo: async (id, updates) => {
        const { error } = await api.patch(`/todos/${id}`, updates);
        if (error) throw new Error(error);
        set((s) => ({
          todos: s.todos.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)),
        }));
      },

      deleteTodo: async (id) => {
        const { error } = await api.delete(`/todos/${id}`);
        if (error) throw new Error(error);
        set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }));
      },

      moveTodo: async (id, status) => {
        await get().updateTodo(id, { status });
      },

      setFilter: (filter) => {
        set((s) => ({ filter: { ...s.filter, ...filter } }));
      },

      getFilteredTodos: () => {
        const { todos, filter } = get();
        return todos.filter((t) => {
          if (filter.status && t.status !== filter.status) return false;
          if (filter.priority && t.priority !== filter.priority) return false;
          if (filter.tag && !t.tags.includes(filter.tag)) return false;
          if (filter.search) {
            const q = filter.search.toLowerCase();
            if (!t.title.toLowerCase().includes(q) && !t.description?.toLowerCase().includes(q))
              return false;
          }
          return true;
        });
      },

      canAddTodo: () => {
        const isPremium = useSubscriptionStore.getState().isPremium();
        if (isPremium) return true;
        return get().todos.length < FREE_TIER_LIMITS.maxTodos;
      },
    }),
    {
      name: 'todo-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ todos: state.todos }),
    },
  ),
);
