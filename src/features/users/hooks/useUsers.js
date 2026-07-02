import { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';
import { handleApiError } from '../../../services/errorHandler';

function extractPaginatedData(response) {
  const body = response.data;
  const result = body.data || body;
  return {
    items: result.data || result,
    pagination: {
      page: result.current_page || 1,
      totalPages: result.last_page || 1,
      total: result.total || 0,
    },
  };
}

function extractItem(response) {
  const body = response.data;
  return body.data || body;
}

export function useUsers(params = {}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchUsers = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getAll({ page, per_page: perPage, ...params });
      const { items, pagination: pag } = extractPaginatedData(response);
      setUsers(items);
      setPagination(pag);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return { users, loading, error, pagination, fetchUsers };
}

export function useUser(ref) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ref) { setLoading(false); return; }
    setLoading(true);
    userService.getByReference(ref)
      .then((response) => setUser(extractItem(response)))
      .catch((err) => setError(handleApiError(err)))
      .finally(() => setLoading(false));
  }, [ref]);

  return { user, loading, error };
}
