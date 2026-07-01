import { useState, useEffect, useCallback } from 'react';
import expenseService from '../services/expenseService';
import { handleApiError } from '../../../services/errorHandler';

export function useExpenses(params = {}) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchExpenses = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await expenseService.getAll({ page, per_page: perPage, ...params });
      const data = response.data;
      setExpenses(data.data || data);
      if (data.meta) {
        setPagination({
          page: data.meta.current_page,
          totalPages: data.meta.last_page,
          total: data.meta.total,
        });
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const createExpense = async (data) => {
    try {
      const response = await expenseService.create(data);
      setExpenses((prev) => [response.data.data || response.data, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, error: handleApiError(err) };
    }
  };

  const updateExpense = async (ref, data) => {
    try {
      const response = await expenseService.update(ref, data);
      const updated = response.data.data || response.data;
      setExpenses((prev) => prev.map((e) => (e.reference === ref ? updated : e)));
      return { success: true, data: updated };
    } catch (err) {
      return { success: false, error: handleApiError(err) };
    }
  };

  const deleteExpense = async (ref) => {
    try {
      await expenseService.remove(ref);
      setExpenses((prev) => prev.filter((e) => e.reference !== ref));
      return { success: true };
    } catch (err) {
      return { success: false, error: handleApiError(err) };
    }
  };

  return {
    expenses,
    loading,
    error,
    pagination,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}

export function useAdminExpenses(params = {}) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchExpenses = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await expenseService.getAdminAll({ page, per_page: perPage, ...params });
      const data = response.data;
      setExpenses(data.data || data);
      if (data.meta) {
        setPagination({
          page: data.meta.current_page,
          totalPages: data.meta.last_page,
          total: data.meta.total,
        });
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const approveExpense = async (ref) => {
    try {
      const response = await expenseService.approve(ref);
      const updated = response.data.data || response.data;
      setExpenses((prev) => prev.map((e) => (e.reference === ref ? updated : e)));
      return { success: true };
    } catch (err) {
      return { success: false, error: handleApiError(err) };
    }
  };

  const rejectExpense = async (ref) => {
    try {
      const response = await expenseService.reject(ref);
      const updated = response.data.data || response.data;
      setExpenses((prev) => prev.map((e) => (e.reference === ref ? updated : e)));
      return { success: true };
    } catch (err) {
      return { success: false, error: handleApiError(err) };
    }
  };

  return {
    expenses,
    loading,
    error,
    pagination,
    fetchExpenses,
    approveExpense,
    rejectExpense,
  };
}
