import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/shared/Toast';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const { user } = useAuthStore();
  const { updateProfile, changePassword, loading, error } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordForm.new_password.length < 6) {
      setPasswordError(t('profile.passwordMin6'));
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError(t('profile.passwordMismatch'));
      return;
    }

    setPasswordLoading(true);
    const result = await changePassword({
      current_password: passwordForm.current_password,
      new_password: passwordForm.new_password,
    });
    setPasswordLoading(false);

    if (result) {
      showToast(t('profile.passwordChanged'));
      setShowPasswordModal(false);
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } else {
      setPasswordError(error || t('common.errorOccurred'));
    }
  };

  const openPasswordModal = () => {
    setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    setPasswordError('');
    setShowPasswordModal(true);
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
            {user?.role === 'admin' ? t('sidebar.admin') : user?.role === 'manager' ? t('sidebar.manager') : t('sidebar.employee')}
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
            <h3 className={styles.cardTitle}>{t('profile.security')}</h3>
            <div className={styles.settingRow}>
              <span className={styles.settingLabel}>{t('profile.password')}</span>
              <Button variant="ghost" size="sm" onClick={openPasswordModal}>
                {t('profile.changePassword')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPasswordModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{t('profile.changePasswordTitle')}</h3>
            <form onSubmit={handlePasswordSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>{t('profile.currentPassword')}</label>
                <input
                  className={styles.input}
                  name="current_password"
                  type="password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t('profile.newPassword')}</label>
                <input
                  className={styles.input}
                  name="new_password"
                  type="password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t('profile.confirmPassword')}</label>
                <input
                  className={styles.input}
                  name="confirm_password"
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              {passwordError && <p className={styles.error}>{passwordError}</p>}
              <div className={styles.modalActions}>
                <Button type="button" variant="ghost" onClick={() => setShowPasswordModal(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? t('profile.saving') : t('profile.changePassword')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
