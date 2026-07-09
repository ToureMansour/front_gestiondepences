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
      {/* Full-screen background image */}
      <div className={styles.bg}>
        <img
          src="/images/login-illustration.png"
          alt=""
          className={styles.bgImage}
        />
      </div>
      <div className={styles.overlay} />

      {/* Top bar */}
      <div className={styles.topBar}>
        <Link to="/" className={styles.homeLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.leftContent}>
          <Link to="/" className={styles.brandLink}>
            <div className={styles.brandIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CCFBF1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className={styles.brandName}>Depensys</span>
          </Link>
          <p className={styles.tagline}>
            {t('auth.tagline')}
          </p>
        </div>

        <div className={styles.card}>
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
