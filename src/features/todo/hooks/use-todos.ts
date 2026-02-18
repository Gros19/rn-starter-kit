import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as todoMock from '../mock';
import type { Todo, TodoFilter, CreateTodoPayload, UpdateTodoPayload } from '../types';

const TODOS_KEY = ['todos'] as const;

export function useTodos(filter?: TodoFilter) {
  return useQuery({
    queryKey: [...TODOS_KEY, filter],
    queryFn: () => todoMock.getTodos(filter),
  });
}

export function useTodo(id: string) {
  return useQuery({
    queryKey: [...TODOS_KEY, id],
    queryFn: () => todoMock.getTodo(id),
    enabled: !!id,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTodoPayload) => todoMock.createTodo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateTodoPayload & { id: string }) =>
      todoMock.updateTodo(id, payload),
    onMutate: async ({ id, ...payload }) => {
      await queryClient.cancelQueries({ queryKey: TODOS_KEY });
      const previousTodos = queryClient.getQueryData<Todo[]>(TODOS_KEY);

      // 낙관적 업데이트
      queryClient.setQueriesData<Todo[]>(
        { queryKey: TODOS_KEY },
        (old) =>
          old?.map((t) =>
            t.id === id ? { ...t, ...payload, updatedAt: new Date().toISOString() } : t,
          ),
      );

      return { previousTodos };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTodos) {
        queryClient.setQueriesData({ queryKey: TODOS_KEY }, context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => todoMock.deleteTodo(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TODOS_KEY });
      const previousTodos = queryClient.getQueryData<Todo[]>(TODOS_KEY);

      queryClient.setQueriesData<Todo[]>(
        { queryKey: TODOS_KEY },
        (old) => old?.filter((t) => t.id !== id),
      );

      return { previousTodos };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueriesData({ queryKey: TODOS_KEY }, context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}
