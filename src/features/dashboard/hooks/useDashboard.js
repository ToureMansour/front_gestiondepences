import { useState, useEffect, useCallback } from 'react';
import { handleApiError } from '../../../services/errorHandler';
import apiClient from '../../../services/apiClient';

function normalizeStats(data) {
  return {
    total: data.total_expenses || 0,
    pending: data.pending_expenses || 0,
    approved: data.approved_expenses || 0,
    rejected: data.rejected_expenses || 0,
    paid: data.paid_expenses || 0,
    cancelled: data.cancelled_expenses || 0,
    totalAmount:
      data.total_amount || 0 ||
      parseFloat(data.total_amount_pending || 0) +
      parseFloat(data.total_amount_approved || 0) +
      parseFloat(data.total_amount_paid || 0),
    totalAmountPending: parseFloat(data.total_amount_pending || 0),
    totalAmountApproved: parseFloat(data.total_amount_approved || 0),
    totalAmountPaid: parseFloat(data.total_amount_paid || 0),
  };
}

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/stats');
        const body = response.data;
        const data = body.data || body;
        setStats(normalizeStats(data));
      } catch (err) {
        setError(handleApiError(err));
        setStats(normalizeStats({}));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useDashboardExpenses(perPage = 100) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/expenses', { params: { per_page: perPage } });
      const body = response.data;
      const result = body.data || body;
      const items = result.data || result;
      setExpenses(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  return { expenses, loading, error, fetchExpenses };
}

export function getStatusColor(status) {
  switch (String(status || '').toLowerCase()) {
    case 'pending': return 'var(--color-warning)';
    case 'approved': return 'var(--color-success)';
    case 'rejected': return 'var(--color-danger)';
    case 'paid': return 'var(--color-info)';
    default: return 'var(--color-text-muted)';
  }
}
