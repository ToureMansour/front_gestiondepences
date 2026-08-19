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
      {/* ── Left zone: visual universe ── */}
      <div className={styles.left}>
        <Link to="/" className={styles.homeLink}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {t('auth.backToHome')}
        </Link>

        <div className={styles.brand}>
          <Link to="/" className={styles.brandLink}>
            <div className={styles.brandIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CCFBF1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

        <div className={styles.glow} />
        <div className={styles.illustrationWrapper}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Depensys
              </div>
              <div className={styles.panelBadge}>
                <span className={styles.panelBadgeDot} /> Live
              </div>
            </div>
            <div className={styles.panelStats}>
              <div className={styles.panelStat}>
                <span className={styles.panelStatValue}>2 450 000</span>
                <span className={styles.panelStatLabel}>CFA</span>
              </div>
              <div className={styles.panelStatMini}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
                +24.5%
              </div>
            </div>
            <div className={styles.panelChart}>
              <div className={styles.panelBar} style={{ height: '40%' }} />
              <div className={styles.panelBar} style={{ height: '65%' }} />
              <div className={styles.panelBar} style={{ height: '50%' }} />
              <div className={styles.panelBar} style={{ height: '80%' }} />
              <div className={styles.panelBar} style={{ height: '60%' }} />
              <div className={styles.panelBar} style={{ height: '95%' }} />
              <div className={styles.panelBar} style={{ height: '70%' }} />
              <div className={styles.panelBar} style={{ height: '85%' }} />
            </div>
            <div className={styles.panelRow}>
              <div className={styles.panelRowDot} style={{ background: '#2DD4BF' }} />
              <span className={styles.panelRowText}>Notes de frais validées</span>
              <span className={styles.panelRowAmount}>128</span>
            </div>
            <div className={styles.panelRow}>
              <div className={styles.panelRowDot} style={{ background: '#FBBF24' }} />
              <span className={styles.panelRowText}>En attente de validation</span>
              <span className={styles.panelRowAmount}>14</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right zone: form ── */}
      <div className={styles.right}>
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

        <div className={styles.formContainer}>
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
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default AuthLayout;
