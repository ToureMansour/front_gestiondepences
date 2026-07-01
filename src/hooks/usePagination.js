import { useState, useCallback } from 'react';

export function usePagination(initialPage = 1, initialPerPage = 10) {
  const [page, setPage] = useState(initialPage);
  const [perPage] = useState(initialPerPage);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const handlePageChange = useCallback((newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  }, [totalPages]);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    perPage,
    total,
    totalPages,
    setTotal,
    setPage: handlePageChange,
    resetPage,
    nextPage: () => handlePageChange(page + 1),
    prevPage: () => handlePageChange(page - 1),
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
