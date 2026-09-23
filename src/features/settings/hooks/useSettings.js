import { useState, useEffect, useCallback } from 'react';
import settingsService from '../services/settingsService';
import { handleApiError } from '../../../services/errorHandler';

export function useSettings() {
  const [settings, setSettings] = useState({ organization_name: '', logo: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await settingsService.get();
      const data = response.data.data || response.data;
      setSettings({
        organization_name: data.organization_name || '',
        logo: data.logo || data.organization_logo || null,
      });
    } catch (err) {
      const appError = handleApiError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async ({ organization_name, logo }) => {
    setSaving(true);
    setError(null);
    try {
      const response = await settingsService.update({ organization_name, logo });
      const data = response.data.data || response.data;
      setSettings((prev) => ({
        organization_name: data.organization_name || organization_name,
        logo: data.logo || data.organization_logo || prev.logo || null,
      }));
      return true;
    } catch (err) {
      const appError = handleApiError(err);
      setError(appError.message);
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    saving,
    error,
    updateSettings,
  };
}
