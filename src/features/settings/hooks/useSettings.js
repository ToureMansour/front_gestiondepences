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
    } catch {
      // fallback to localStorage
      const saved = localStorage.getItem('depensys_settings');
      if (saved) {
        try { setSettings(JSON.parse(saved)); } catch { /* ignore */ }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (newSettings) => {
    setSaving(true);
    setError(null);
    try {
      await settingsService.updateOrg({ organization_name: newSettings.organization_name });
      await settingsService.updateNotifications({ notifications_enabled: newSettings.notifications_enabled });
      setSettings(newSettings);
      localStorage.setItem('depensys_settings', JSON.stringify(newSettings));
      return true;
    } catch (err) {
      const appError = handleApiError(err);
      setError(appError.message);
      // still save locally as fallback
      setSettings(newSettings);
      localStorage.setItem('depensys_settings', JSON.stringify(newSettings));
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
