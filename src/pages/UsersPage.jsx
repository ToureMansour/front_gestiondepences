import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUsers } from '../features/users/hooks/useUsers';
import { Pagination } from '../components/ui/Pagination';
import ErrorMessage from '../components/shared/ErrorMessage';
import { SkeletonTable } from '../components/shared/Skeleton';
import { formatDate } from '../utils/formatDate';
import styles from './UsersPage.module.css';

const ROLE_KEYS = {
  admin: 'users.admin',
  manager: 'users.manager',
  employee: 'users.employee',
};

function RoleBadge({ role }) {
  const { t } = useTranslation();
  return (
    <span className={`${styles.roleBadge} ${styles[`role_${role}`] || styles.role_default}`}>
      {t(ROLE_KEYS[role] || 'users.employee')}
    </span>
  );
}

function UsersPage() {
  const { t } = useTranslation();
  const { users, loading, error, pagination, fetchUsers } = useUsers();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => { fetchUsers(page); }, [page, fetchUsers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchQ = !q || (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
      const matchRole = !roleFilter || u.role === roleFilter;
      return matchQ && matchRole;
    });
  }, [users, query, roleFilter]);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('users.searchPlaceholder')}
            aria-label={t('users.searchPlaceholder')}
          />
        </div>
        <select
          className={styles.select}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          aria-label={t('users.role')}
        >
          <option value="">{t('users.allRoles')}</option>
          <option value="admin">{t('users.admin')}</option>
          <option value="manager">{t('users.manager')}</option>
          <option value="employee">{t('users.employee')}</option>
        </select>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <SkeletonTable rows={7} cols={4} />
        ) : error ? (
          <ErrorMessage message={error.message} />
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <h3 className={styles.emptyTitle}>{t('users.emptyTitle')}</h3>
            <p className={styles.emptyMessage}>{t('users.emptyMessage')}</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('users.name')}</th>
                  <th>{t('users.email')}</th>
                  <th>{t('users.role')}</th>
                  <th>{t('users.dateRegistered')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.reference || u.id}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>
                          {(u.name || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <p className={styles.userName}>{u.name}</p>
                          <p className={styles.userRef}>{u.reference}</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.emailCell}>{u.email}</td>
                    <td><RoleBadge role={u.role} /></td>
                    <td className={styles.dateCell}>{formatDate(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className={styles.paginationRow}>
          <span className={styles.totalLabel}>{pagination.total} {t('expenses.totalResults')}</span>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}

export default UsersPage;
