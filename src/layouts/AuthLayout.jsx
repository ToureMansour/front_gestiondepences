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
    <div className={styles.split}>
      {/* ── Left panel: brand + illustration ── */}
      <div className={styles.left}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
        <div className={styles.meshOverlay} />

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

          <div className={styles.illustration}>
            <WalletIllustration />
          </div>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className={styles.right}>
        <div className={styles.rightInner}>
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

function WalletIllustration() {
  const { t } = useTranslation();
  return (
    <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
        <linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <filter id="shadow1">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
        </filter>
        <filter id="shadow2">
          <feDropShadow dx="0" dy="6" stdDeviation="12" floodOpacity="0.2" />
        </filter>
      </defs>

      <circle cx="200" cy="140" r="120" fill="rgba(204,251,241,0.06)" />

      {/* Wallet body */}
      <rect x="60" y="100" width="280" height="160" rx="20" fill="url(#walletGrad)" filter="url(#shadow2)" />

      {/* Wallet stitching */}
      <rect x="70" y="110" width="260" height="140" rx="14" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 3" fill="none" />

      {/* Wallet flap fold */}
      <line x1="60" y1="160" x2="340" y2="160" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* Card peeking out */}
      <g filter="url(#shadow1)">
        <rect x="80" y="72" width="240" height="150" rx="14" fill="url(#cardGrad)" />
        <rect x="80" y="72" width="240" height="150" rx="14" fill="url(#cardGrad)" opacity="0.3" />
      </g>

      {/* Card chip */}
      <rect x="110" y="96" width="36" height="26" rx="4" fill="rgba(255,255,255,0.25)" />
      <rect x="114" y="100" width="28" height="18" rx="2" fill="rgba(255,255,255,0.1)" />

      {/* Card brand circles */}
      <circle cx="290" cy="100" r="10" fill="rgba(255,255,255,0.2)" />
      <circle cx="280" cy="100" r="10" fill="rgba(255,255,255,0.15)" />

      {/* Card number */}
      <text x="110" y="158" fill="rgba(255,255,255,0.6)" fontSize="14" fontFamily="monospace" letterSpacing="4">
        4242  &bull;&bull;&bull;&bull;  &bull;&bull;&bull;&bull;  4242
      </text>

      {/* Card holder */}
      <text x="110" y="186" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="sans-serif" letterSpacing="1">
        {t('wallet.cardholder')}
      </text>
      <text x="110" y="202" fill="rgba(255,255,255,0.75)" fontSize="13" fontFamily="sans-serif" fontWeight="600">
        DEPENSYS PRO
      </text>

      {/* Card expiry */}
      <text x="270" y="186" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="sans-serif" letterSpacing="1">
        {t('wallet.expiration')}
      </text>
      <text x="270" y="202" fill="rgba(255,255,255,0.75)" fontSize="13" fontFamily="sans-serif" fontWeight="600">
        12/28
      </text>

      {/* Coins */}
      <g>
        <circle cx="80" cy="240" r="12" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
        <text x="76" y="244" fill="#92400E" fontSize="9" fontWeight="700">$</text>
      </g>
      <g style={{ animation: 'coinFloat 3s ease-in-out infinite' }}>
        <circle cx="320" cy="230" r="10" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
        <text x="317" y="234" fill="#92400E" fontSize="8" fontWeight="700">$</text>
      </g>
      <g style={{ animation: 'coinFloat 3.5s ease-in-out infinite 0.5s' }}>
        <circle cx="295" cy="248" r="9" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
        <text x="292" y="251" fill="#92400E" fontSize="7" fontWeight="700">$</text>
      </g>

      {/* Green check */}
      <g transform="translate(260, 84)">
        <circle cx="10" cy="10" r="10" fill="#059669" />
        <path d="M6 10l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* Rising graph line */}
      <polyline
        points="60,265 120,260 160,240 210,245 260,220 310,225 340,200"
        stroke="rgba(45,212,191,0.3)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="340" cy="200" r="3" fill="#2DD4BF" />
    </svg>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default AuthLayout;
