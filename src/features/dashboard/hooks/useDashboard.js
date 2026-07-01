import { useState, useEffect } from 'react';
import { handleApiError } from '../../../services/errorHandler';
import apiClient from '../../../services/apiClient';
import useAuthStore from '../../../store/authStore';

export function useDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const endpoint = user?.role === 'admin' ? '/admin/expenses' : '/expenses';
        const response = await apiClient.get(endpoint);
        const data = response.data.data || response.data;
        const total = Array.isArray(data) ? data.length : (data?.total || 0);
        const approved = Array.isArray(data)
          ? data.filter((e) => e.status === 'approved').length
          : 0;
        const pending = Array.isArray(data)
          ? data.filter((e) => e.status === 'pending').length
          : 0;
        const totalAmount = Array.isArray(data)
          ? data.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
          : 0;
        setStats({ total, approved, pending, totalAmount });
      } catch (err) {
        setError(handleApiError(err));
        setStats({ total: 0, approved: 0, pending: 0, totalAmount: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  return { stats, loading, error };
}
