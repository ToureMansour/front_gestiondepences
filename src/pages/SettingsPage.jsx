import { useState, useEffect, useRef } from 'react';
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
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (settings) {
      setOrgName(settings.organization_name || '');
      const url = settings.logo || null;
      setLogoPreview(url);
    }
  }, [settings]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|svg\+xml|webp)$/.test(file.type)) {
      showToast(t('settings.logoInvalidType'), 'error');
      e.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast(t('settings.logoTooLarge'), 'error');
      e.target.value = '';
      return;
    }
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const result = await updateSettings({
      organization_name: orgName,
      logo: logo || undefined,
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
          <h3 className={styles.cardTitle}>{t('settings.organization')}</h3>
          <p className={styles.cardSub}>{t('settings.organizationDesc')}</p>

          <div className={styles.field}>
            <label className={styles.label}>{t('settings.orgName')} *</label>
            <input
              className={styles.input}
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder={t('settings.orgNamePlaceholder')}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t('settings.logo')}</label>
            <div className={styles.logoRow}>
              <div className={styles.logoPreview}>
                {logoPreview ? (
                  <img src={logoPreview} alt={t('settings.logo')} className={styles.logoImg} />
                ) : (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                )}
              </div>
              <div className={styles.logoActions}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/svg+xml,image/webp"
                  onChange={handleLogoChange}
                  className={styles.fileInput}
                  id="settings-logo-input"
                />
                <label htmlFor="settings-logo-input" className={styles.fileLabel}>
                  {t((logo || logoPreview) ? 'settings.replaceLogo' : 'settings.uploadLogo')}
                </label>
                {(logoPreview || logo) && (
                  <button type="button" className={styles.removeLogoBtn} onClick={() => { setLogo(null); setLogoPreview(null); }}>
                    {t('settings.removeLogo')}
                  </button>
                )}
              </div>
            </div>
            <p className={styles.logoHint}>{t('settings.logoHint')}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="submit" disabled={saving || !orgName.trim()}>
            {saving ? t('common.loading') : t('settings.save')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SettingsPage;