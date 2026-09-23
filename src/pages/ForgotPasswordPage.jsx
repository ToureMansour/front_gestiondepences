import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/shared/Toast';
import styles from '../features/auth/components/LoginForm.module.css';

function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { forgotPassword, loading, error } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await forgotPassword({ email });
    if (result) {
      showToast(t('auth.forgotPasswordSuccess'), 'success');
      setSubmitted(true);
    }
  };

  return (
    <AuthLayout title={t('auth.forgotPasswordTitle')}>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', margin: '0 0 24px', lineHeight: '1.5' }}>
        {t('auth.forgotPasswordDesc')}
      </p>

      {submitted ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9FBE1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p style={{ color: '#fff', fontWeight: 600, marginBottom: '24px', fontSize: '14px' }}>
            {t('auth.forgotPasswordSuccess')}
          </p>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button variant="primary" fullWidth>{t('auth.login')}</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>{t('auth.email')}</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              required
            />
          </div>
          {error && <p className={styles.apiErrorText}>{error}</p>}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : t('auth.resetPassword')}
          </button>
        </form>
      )}

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
        <Link to="/login" style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}>
          {t('auth.backToLogin')}
        </Link>
      </p>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
