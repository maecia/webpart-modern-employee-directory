import { useState, useMemo, useCallback } from 'react';

export const DEFAULT_PAGE_SIZE = 24;

/** Values offered by the "Items per page" property pane setting. */
export const PAGE_SIZE_OPTIONS = [12, 24, 36, 48];

interface UsePaginationResult<T> {
  /** Current page (1-based, always clamped to the available pages). */
  page: number;
  totalPages: number;
  totalItems: number;
  /** 1-based index of the first item on the current page (0 when empty). */
  startIndex: number;
  /** 1-based index of the last item on the current page. */
  endIndex: number;
  /** Items belonging to the current page. */
  pageItems: T[];
  setPage: (page: number) => void;
  reset: () => void;
}

export function usePagination<T>(
  items: T[],
  pageSize: number = DEFAULT_PAGE_SIZE,
): UsePaginationResult<T> {
  const safeSize = pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE;
  const [requestedPage, setRequestedPage] = useState(1);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safeSize));
  // Derived page: automatically clamps when the item count shrinks (search/filter).
  const page = Math.min(Math.max(1, requestedPage), totalPages);

  const pageItems = useMemo(() => {
    const start = (page - 1) * safeSize;
    return items.slice(start, start + safeSize);
  }, [items, page, safeSize]);

  const startIndex = totalItems === 0 ? 0 : (page - 1) * safeSize + 1;
  const endIndex = Math.min(page * safeSize, totalItems);

  const setPage = useCallback((next: number) => {
    setRequestedPage(Math.max(1, next));
  }, []);

  const reset = useCallback(() => setRequestedPage(1), []);

  return {
    page,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    pageItems,
    setPage,
    reset,
  };
}
