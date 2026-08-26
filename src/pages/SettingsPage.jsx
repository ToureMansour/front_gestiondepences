import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/shared/Toast';
import { useSettings } from '../features/settings/hooks/useSettings';
import styles from './SettingsPage.module.css';

function SettingsPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { settings, loading, saving, updateSettings } = useSettings();
  const [orgName, setOrgName] = useState('');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifApp, setNotifApp] = useState(true);

  useEffect(() => {
    if (settings) {
      setOrgName(settings.organization_name || '');
      setNotifEmail(settings.notifications_email ?? true);
      setNotifApp(settings.notifications_app ?? true);
    }
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    const result = await updateSettings({
      organization_name: orgName,
      notifications_email: notifEmail,
      notifications_app: notifApp,
    });
    if (result) {
      showToast(t('toast.settingsSaved'));
    } else {
      showToast(t('common.errorOccurred'), 'error');
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.card} style={{ opacity: 0.5 }}>
          <div style={{ height: '20px', background: 'var(--color-bg)', borderRadius: '4px', width: '120px' }} />
          <div style={{ height: '14px', background: 'var(--color-bg)', borderRadius: '4px', width: '200px', marginTop: '8px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSave}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{t('settings.general')}</h3>
          <p className={styles.cardSub}>{t('settings.organization')}</p>

          <div className={styles.field}>
            <label className={styles.label}>{t('settings.orgName')}</label>
            <input
              className={styles.input}
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder={t('settings.orgNamePlaceholder')}
            />
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{t('settings.notifications')}</h3>
          <p className={styles.cardSub}>{t('profile.preferences')}</p>

          <div className={styles.toggles}>
            <label className={styles.toggleRow}>
              <span className={styles.toggleLabel}>{t('profile.notifEmail')}</span>
              <input
                type="checkbox"
                className={styles.toggle}
                checked={notifEmail}
                onChange={(e) => setNotifEmail(e.target.checked)}
              />
            </label>
            <label className={styles.toggleRow}>
              <span className={styles.toggleLabel}>{t('profile.notifApp')}</span>
              <input
                type="checkbox"
                className={styles.toggle}
                checked={notifApp}
                onChange={(e) => setNotifApp(e.target.checked)}
              />
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="submit" disabled={saving}>
            {saving ? t('common.loading') : t('settings.save')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SettingsPage;
