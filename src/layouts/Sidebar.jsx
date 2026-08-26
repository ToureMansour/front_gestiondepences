import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import styles from './Sidebar.module.css';

const Icons = {
  dashboard: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  expenses: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  categories: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </svg>
  ),
  reports: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
      <line x1="8" y1="9" x2="10" y2="9" />
    </svg>
  ),
  settings: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  chevronRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  chevronDown: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  users: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  const isAdmin = user?.role === 'admin';

  const NAV_ITEMS = [
    { to: '/dashboard', label: t('sidebar.dashboard'), icon: Icons.dashboard, roles: ['admin', 'employee'] },
    { to: '/expenses', label: t('sidebar.expenses'), icon: Icons.expenses, roles: ['admin', 'employee'] },
    { to: '/categories', label: t('sidebar.categories'), icon: Icons.categories, roles: ['admin', 'employee'] },
    { to: '/reports', label: t('sidebar.reports'), icon: Icons.reports, roles: ['admin'] },
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CCFBF1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <h1 className={styles.logoName}>{t('sidebar.appName')}</h1>
            <p className={styles.logoDesc}>{t('sidebar.appDesc')}</p>
          </div>
        )}
      </div>

      <nav className={styles.nav}>
        {!collapsed && <p className={styles.navLabel}>{t('sidebar.menu')}</p>}
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
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}

        {isAdmin && (
          <div className={styles.navGroup}>
            <button
              className={`${styles.navItem} ${styles.navItemBtn} ${
                location.pathname.startsWith('/settings') ? styles.navItemActive : ''
              }`}
              onClick={() => setSettingsOpen((prev) => !prev)}
              title={collapsed ? t('sidebar.settings') : undefined}
            >
              {Icons.settings}
              {!collapsed && (
                <>
                  <span className={styles.navItemLabel}>{t('sidebar.settings')}</span>
                  <span className={`${styles.chevron} ${settingsOpen ? styles.chevronOpen : ''}`}>
                    {Icons.chevronDown}
                  </span>
                </>
              )}
            </button>
            {settingsOpen && !collapsed && (
              <div className={styles.subNav}>
                <NavLink
                  to="/settings"
                  end
                  className={({ isActive }) =>
                    `${styles.subNavItem} ${isActive && !location.pathname.includes('/settings/users') ? styles.subNavItemActive : ''}`
                  }
                  onClick={onClose}
                >
                  {t('settings.general')}
                </NavLink>
                <NavLink
                  to="/settings/users"
                  className={({ isActive }) =>
                    `${styles.subNavItem} ${isActive ? styles.subNavItemActive : ''}`
                  }
                  onClick={onClose}
                >
                  {t('sidebar.users')}
                </NavLink>
              </div>
            )}
          </div>
        )}
      </nav>

      <div className={styles.bottom}>
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

        <button
          className={styles.collapseBtn}
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand' : 'Collapse'}
          aria-label="Toggle sidebar"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${styles.collapseIcon} ${collapsed ? styles.collapseIconRotated : ''}`}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  collapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
};

export default Sidebar;
