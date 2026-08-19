import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/shared/Toast';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const { user } = useAuthStore();
  const { updateProfile, loading, error } = useAuth();
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(form);
    if (result) {
      showToast(t('toast.profileUpdated'));
    } else if (error) {
      showToast(error, 'error');
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <div className={styles.page}>
      <div className={styles.cover}>
        <div className={styles.avatarLarge}>
          {getInitials(user?.name)}
        </div>
        <div>
          <h2 className={styles.name}>{user?.name}</h2>
          <p className={styles.email}>{user?.email}</p>
          <span className={styles.role}>
            {user?.role === 'admin' ? t('sidebar.admin') : t('sidebar.employee')}
          </span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{t('profile.personalInfo')}</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>{t('profile.name')}</label>
              <input
                className={styles.input}
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t('profile.email')}</label>
              <input
                className={styles.input}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? t('profile.saving') : t('profile.save')}
            </Button>
          </form>
        </div>

        <div className={styles.side}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>{t('profile.preferences')}</h3>
            <div className={styles.settingRow}>
              <span className={styles.settingLabel}>{t('profile.language')}</span>
              <div className={styles.langGroup}>
                <button
                  className={`${styles.langBtn} ${i18n.language === 'fr' ? styles.langActive : ''}`}
                  onClick={() => changeLanguage('fr')}
                >
                  FR
                </button>
                <button
                  className={`${styles.langBtn} ${i18n.language === 'en' ? styles.langActive : ''}`}
                  onClick={() => changeLanguage('en')}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>{t('profile.security')}</h3>
            <div className={styles.settingRow}>
              <span className={styles.settingLabel}>{t('profile.password')}</span>
              <Button variant="ghost" size="sm">
                {t('profile.changePassword')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
