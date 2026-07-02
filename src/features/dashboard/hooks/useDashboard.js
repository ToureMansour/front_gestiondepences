import { useState, useEffect } from 'react';
import { handleApiError } from '../../../services/errorHandler';
import apiClient from '../../../services/apiClient';

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
        setStats({
          total: data.total_expenses || 0,
          approved: data.approved_count || 0,
          pending: data.pending_count || 0,
          totalAmount: parseFloat(data.total_amount || 0),
        });
      } catch (err) {
        setError(handleApiError(err));
        setStats({ total: 0, approved: 0, pending: 0, totalAmount: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading, error };
}
