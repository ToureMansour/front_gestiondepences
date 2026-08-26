import { useState, useEffect, useCallback } from 'react';
import settingsService from '../services/settingsService';
import { handleApiError } from '../../../services/errorHandler';

export function useSettings() {
  const [settings, setSettings] = useState({ organization_name: '', notifications_enabled: true });
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
        notifications_enabled: data.notifications_enabled !== false,
      });
    } catch (err) {
      const appError = handleApiError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (newSettings) => {
    setSaving(true);
    setError(null);
    try {
      const response = await settingsService.update(newSettings);
      const data = response.data.data || response.data;
      setSettings({
        organization_name: data.organization_name || newSettings.organization_name,
        notifications_enabled: data.notifications_enabled ?? newSettings.notifications_enabled,
      });
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
