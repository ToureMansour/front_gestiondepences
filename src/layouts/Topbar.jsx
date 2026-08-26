import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useNotifications } from '../features/notifications/hooks/useNotifications';
import styles from './Topbar.module.css';

function useClickOutside(onClick) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClick();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClick]);
  return ref;
}

function Topbar({ onMenuClick }) {
  const { user, logout } = useAuthStore();
  const { logout: apiLogout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [query, setQuery] = useState('');
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const profileRef = useClickOutside(() => setOpenDropdown(null));

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      logout();
    }
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/expenses?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <form className={styles.search} onSubmit={handleSearch}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('topbar.searchPlaceholder')}
            aria-label={t('topbar.searchPlaceholder')}
          />
        </form>
      </div>

      <div className={styles.right}>
        <div className={styles.notifWrap}>
          <button
            className={styles.iconBtn}
            onClick={() => setOpenDropdown(openDropdown === 'notif' ? null : 'notif')}
            aria-label={t('topbar.notifications')}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className={`${styles.notifDot} ${unreadCount === 0 ? styles.notifDotHidden : ''}`} />
          </button>
          {openDropdown === 'notif' && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                <span className={styles.notifTitle}>{t('topbar.notifications')}</span>
                <button className={styles.markAll} onClick={markAllAsRead}>{t('topbar.markAllRead')}</button>
              </div>
              <div className={styles.notifList}>
                {notifications.length === 0 ? (
                  <div className={styles.notifEmpty}>{t('topbar.noNotifications')}</div>
                ) : notifications.map((n) => (
                  <div key={n.id} className={`${styles.notifItem} ${!n.read_at ? styles.notifUnread : ''}`} onClick={() => markAsRead(n.id)}>
                    <div className={styles.notifIcon}>
                      {n.type === 'expense' && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                      )}
                      {n.type === 'user' && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /></svg>
                      )}
                      {n.type === 'approved' && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                      )}
                    </div>
                    <div className={styles.notifBody}>
                      <p className={styles.notifMsgTitle}>{n.title}</p>
                      <p className={styles.notifMsg}>{n.message}</p>
                      <span className={styles.notifTime}>{n.created_at}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.profileWrap} ref={profileRef}>
          <button
            className={styles.profileBtn}
            onClick={() => setOpenDropdown(openDropdown === 'profile' ? null : 'profile')}
          >
            <div className={styles.avatar}>{getInitials(user?.name)}</div>
            <div className={styles.profileMeta}>
              <span className={styles.profileName}>{user?.name}</span>
              <span className={styles.profileRole}>{user?.role === 'admin' ? t('sidebar.admin') : user?.role === 'manager' ? t('sidebar.manager') : t('sidebar.employee')}</span>
            </div>
            <svg className={`${styles.chevron} ${openDropdown === 'profile' ? styles.chevronOpen : ''}`} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {openDropdown === 'profile' && (
            <div className={styles.profileDropdown}>
              <div className={styles.dropdownUser}>
                <div className={styles.dropdownAvatar}>{getInitials(user?.name)}</div>
                <div>
                  <p className={styles.dropdownName}>{user?.name}</p>
                  <p className={styles.dropdownEmail}>{user?.email}</p>
                </div>
              </div>
              <div className={styles.dropdownSep} />
              <Link to="/profile" className={styles.dropdownItem} onClick={() => setOpenDropdown(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                {t('topbar.myProfile')}
              </Link>
              <div className={styles.dropdownSep} />
              <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                {t('topbar.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
