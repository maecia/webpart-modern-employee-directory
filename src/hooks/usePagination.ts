import { useState, useMemo, useCallback } from 'react';

interface PaginationConfig {
  card: number;
  list: number;
}

const PAGE_SIZES: PaginationConfig = {
  card: 24,
  list: 15
};

interface UsePaginationResult<T> {
  visibleItems: T[];
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
}

export function usePagination<T>(
  items: T[],
  view: 'card' | 'list'
): UsePaginationResult<T> {
  const [page, setPage] = useState(1);

  const pageSize = PAGE_SIZES[view];

  const visibleItems = useMemo(() => {
    return items.slice(0, page * pageSize);
  }, [items, page, pageSize]);

  const hasMore = visibleItems.length < items.length;

  const loadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return { visibleItems, hasMore, loadMore, reset };
}
