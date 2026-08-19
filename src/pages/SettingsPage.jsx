import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/shared/Toast';
import styles from './SettingsPage.module.css';

const SETTINGS_KEY = 'depensys_settings';

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
  } catch {
    return {};
  }
}

function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const initial = loadSettings();
  const [orgName, setOrgName] = useState(initial.orgName || '');
  const [notifEmail, setNotifEmail] = useState(initial.notifEmail ?? true);
  const [notifApp, setNotifApp] = useState(initial.notifApp ?? true);
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ orgName, notifEmail, notifApp })
    );
    setTimeout(() => {
      setSaving(false);
      showToast(t('toast.settingsSaved'));
    }, 300);
  };

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
