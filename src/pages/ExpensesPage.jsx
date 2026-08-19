import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import { useExpenses, useAdminExpenses } from '../features/expenses/hooks/useExpenses';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import StatusBadge from '../components/shared/StatusBadge';
import ConfirmModal from '../components/shared/ConfirmModal';
import ErrorMessage from '../components/shared/ErrorMessage';
import { useToast } from '../components/shared/Toast';
import { SkeletonTable } from '../components/shared/Skeleton';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { normalizeStatus } from '../utils/expenseAnalytics';
import styles from './ExpensesPage.module.css';

function ExpensesPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  const [statusFilter, setStatusFilter] = useState('');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const params = useMemo(() => {
    const p = {};
    if (statusFilter) p.status = statusFilter.toUpperCase();
    if (dateFrom) p.date_from = dateFrom;
    if (dateTo) p.date_to = dateTo;
    return p;
  }, [statusFilter, dateFrom, dateTo]);

  const { expenses, loading, error, pagination, fetchExpenses, approveExpense, rejectExpense } = isAdmin
    ? useAdminExpenses(params)
    : useExpenses(params);

  useEffect(() => { setPage(1); }, [JSON.stringify(params)]);

  useEffect(() => { fetchExpenses(page); }, [page, fetchExpenses]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return expenses;
    return expenses.filter((e) =>
      (e.reference || '').toLowerCase().includes(q) ||
      (e.title || '').toLowerCase().includes(q) ||
      (e.user?.name || e.user_name || '').toLowerCase().includes(q)
    );
  }, [expenses, query]);

  const handleApprove = async (row) => {
    setActionLoading(true);
    const result = await approveExpense(row.reference);
    setActionLoading(false);
    if (result.success) {
      showToast(t('toast.expenseApproved'));
    } else {
      showToast(result.error?.message || t('common.errorOccurred'), 'error');
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    setActionLoading(true);
    const result = await rejectExpense(rejectTarget.reference);
    setActionLoading(false);
    setRejectTarget(null);
    if (result.success) {
      showToast(t('toast.expenseRejected'));
    } else {
      showToast(result.error?.message || t('common.errorOccurred'), 'error');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.search}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('expenses.searchPlaceholder')}
              aria-label={t('expenses.searchPlaceholder')}
            />
          </div>
          <select
            className={styles.select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label={t('expenses.filters')}
          >
            <option value="">{t('expenses.allStatus')}</option>
            <option value="pending">{t('expenses.statusPending')}</option>
            <option value="approved">{t('expenses.statusApproved')}</option>
            <option value="rejected">{t('expenses.statusRejected')}</option>
            <option value="paid">{t('expenses.statusPaid')}</option>
            <option value="cancelled">{t('expenses.statusCancelled')}</option>
          </select>
          <input
            type="date"
            className={styles.select}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            aria-label={t('expenses.dateFrom')}
          />
          <input
            type="date"
            className={styles.select}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            aria-label={t('expenses.dateTo')}
          />
          {(statusFilter || dateFrom || dateTo) && (
            <button
              className={styles.resetBtn}
              onClick={() => { setStatusFilter(''); setDateFrom(''); setDateTo(''); }}
            >
              {t('expenses.reset')}
            </button>
          )}
        </div>
        {!isAdmin && (
          <Button onClick={() => navigate('/expenses/new')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t('expenses.newExpense')}
          </Button>
        )}
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <SkeletonTable rows={7} cols={isAdmin ? 7 : 5} />
        ) : error ? (
          <ErrorMessage message={error.message} />
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <polyline points="13 2 13 9 20 9" />
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>{t('expenses.emptyTitle')}</h3>
            <p className={styles.emptyMessage}>{t('expenses.noFiltersResult')}</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('expenses.reference')}</th>
                  {isAdmin && <th>{t('expenses.employee')}</th>}
                  <th>{t('expenses.titleCol')}</th>
                  <th>{t('expenses.amount')}</th>
                  <th>{t('expenses.status')}</th>
                  <th>{t('expenses.date')}</th>
                  {isAdmin && <th className={styles.actionsCol}>{t('expenses.actions')}</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.reference || e.id} className={styles.row} onClick={() => navigate(`/expenses/${e.reference}`)}>
                    <td className={styles.refCell}>{e.reference}</td>
                    {isAdmin && (
                      <td className={styles.userCell}>
                        <div className={styles.userCellInner}>
                          <div className={styles.userAvatar}>
                            {(e.user?.name || e.user_name || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <span>{e.user?.name || e.user_name || '—'}</span>
                        </div>
                      </td>
                    )}
                    <td className={styles.titleCell}>{e.title}</td>
                    <td className={styles.amountCell}>{formatCurrency(e.amount)}</td>
                    <td><StatusBadge status={normalizeStatus(e.status)} /></td>
                    <td className={styles.dateCell}>{formatDate(e.expense_date || e.created_at)}</td>
                    {isAdmin && (
                      <td onClick={(ev) => ev.stopPropagation()}>
                        <div className={styles.rowActions}>
                          {normalizeStatus(e.status) === 'pending' ? (
                            <>
                              <button
                                className={`${styles.actionBtn} ${styles.approve}`}
                                onClick={() => handleApprove(e)}
                                disabled={actionLoading}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                {t('expenses.approve')}
                              </button>
                              <button
                                className={`${styles.actionBtn} ${styles.reject}`}
                                onClick={() => setRejectTarget(e)}
                                disabled={actionLoading}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                {t('expenses.reject')}
                              </button>
                            </>
                          ) : (
                            <span className={styles.statusNote}>{t(`expenses.status${normalizeStatus(e.status).charAt(0).toUpperCase()}${normalizeStatus(e.status).slice(1)}`)}</span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className={styles.paginationRow}>
          <span className={styles.totalLabel}>
            {pagination.total} {t('expenses.totalResults')}
          </span>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <ConfirmModal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleRejectConfirm}
        title={t('expenses.reject')}
        message={t('expenses.rejectConfirm', { ref: rejectTarget?.reference })}
        confirmLabel={t('expenses.reject')}
        loading={actionLoading}
      />
    </div>
  );
}

export default ExpensesPage;
