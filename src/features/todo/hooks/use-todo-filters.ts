import { useState, useCallback } from 'react';
import type { TodoFilter, TodoStatus, TodoPriority } from '../types';

export function useTodoFilters() {
  const [filter, setFilter] = useState<TodoFilter>({});

  const setStatus = useCallback((status: TodoStatus | undefined) => {
    setFilter((prev) => ({ ...prev, status }));
  }, []);

  const setPriority = useCallback((priority: TodoPriority | undefined) => {
    setFilter((prev) => ({ ...prev, priority }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilter((prev) => ({ ...prev, search: search || undefined }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilter({});
  }, []);

  const hasActiveFilters = !!(filter.status || filter.priority || filter.search);

  return { filter, setStatus, setPriority, setSearch, clearFilters, hasActiveFilters };
}
