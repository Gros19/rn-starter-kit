import { useState, useCallback } from 'react';
import type { BoardFilter, PostCategory } from '../types';

export function useBoardFilters() {
  const [filter, setFilter] = useState<BoardFilter>({});

  const setCategory = useCallback((category: PostCategory | undefined) => {
    setFilter((prev) => ({ ...prev, category }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilter((prev) => ({ ...prev, search: search || undefined }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilter({});
  }, []);

  return { filter, setCategory, setSearch, clearFilters };
}
