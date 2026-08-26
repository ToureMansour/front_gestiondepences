import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from './MainLayout.module.css';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const PAGE_TITLES = {
    '/dashboard': t('sidebar.dashboard'),
    '/expenses': t('sidebar.expenses'),
    '/expenses/new': t('sidebar.expenses'),
    '/users': t('sidebar.users'),
    '/categories': t('sidebar.categories'),
    '/reports': t('sidebar.reports'),
    '/settings': t('settings.general'),
    '/settings/users': t('sidebar.users'),
    '/profile': t('sidebar.profile'),
  };

  const title = PAGE_TITLES[location.pathname] || t('sidebar.appName');

  return (
    <div className={styles.layout}>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />
      <div className={`${styles.main} ${collapsed ? styles.mainCollapsed : ''}`}>
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className={styles.content}>
          <h1 className={styles.pageTitle}>{title}</h1>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
