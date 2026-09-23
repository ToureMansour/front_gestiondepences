import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import styles from './AuthLayout.module.css';

function AuthLayout({ children, title }) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <div className={styles.wrapper}>
      <Link to="/" className={styles.backLink}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        {t('auth.backToHome')}
      </Link>

      <div className={styles.langToggle}>
        <button
          className={`${styles.langBtn} ${i18n.language === 'fr' ? styles.langActive : ''}`}
          onClick={() => changeLanguage('fr')}
        >
          FR
        </button>
        <span className={styles.langSep}>|</span>
        <button
          className={`${styles.langBtn} ${i18n.language === 'en' ? styles.langActive : ''}`}
          onClick={() => changeLanguage('en')}
        >
          EN
        </button>
      </div>

      <div className={styles.glow} />

      <div className={styles.formContainer}>
        <div className={styles.card}>
          <img src="/logo.png" alt="Dossy" className={styles.logo} />
          <h2 className={styles.authTitle}>
            {title || t('auth.welcome')}
          </h2>
          <p className={styles.authSubtitle}>
            {t('auth.subtitle')}
          </p>

          {children}
        </div>
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default AuthLayout;