import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import styles from './Sidebar.module.css';

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuthStore();
  const { t, i18n } = useTranslation();

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  const NAV_ITEMS = [
    {
      to: '/dashboard',
      label: t('nav.dashboard'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
      roles: ['admin', 'employee'],
    },
    {
      to: '/expenses',
      label: t('nav.expenses'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      roles: ['admin', 'employee'],
    },
    {
      to: '/users',
      label: t('nav.users'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      roles: ['admin'],
    },
    {
      to: '/profile',
      label: t('nav.profile'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      roles: ['admin', 'employee'],
    },
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.logo}>
        <h1>{t('sidebar.appName')}</h1>
        <p>{t('sidebar.appDesc')}</p>
      </div>
      <nav className={styles.nav}>
        {NAV_ITEMS
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
              onClick={onClose}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
      </nav>
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
      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className={styles.userName}>{user?.name}</p>
            <p className={styles.userRole}>{user?.role === 'admin' ? t('sidebar.admin') : t('sidebar.employee')}</p>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={logout}>
          {t('sidebar.logout')}
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Sidebar;
