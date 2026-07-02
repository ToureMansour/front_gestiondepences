import { useState, useEffect, useCallback } from 'react';
import expenseService from '../services/expenseService';
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
      const { items, pagination: pag } = extractPaginatedData(response);
      setExpenses(items);
      setPagination(pag);
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
      const item = extractItem(response);
      setExpenses((prev) => [item, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, error: handleApiError(err) };
    }
  };

  const updateExpense = async (ref, data) => {
    try {
      const response = await expenseService.update(ref, data);
      const updated = extractItem(response);
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
      const response = await expenseService.getAll({ page, per_page: perPage, ...params });
      const { items, pagination: pag } = extractPaginatedData(response);
      setExpenses(items);
      setPagination(pag);
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
      const updated = extractItem(response);
      setExpenses((prev) => prev.map((e) => (e.reference === ref ? updated : e)));
      return { success: true };
    } catch (err) {
      return { success: false, error: handleApiError(err) };
    }
  };

  const rejectExpense = async (ref) => {
    try {
      const response = await expenseService.reject(ref);
      const updated = extractItem(response);
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
