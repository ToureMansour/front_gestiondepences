import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import { useDashboard, useDashboardExpenses } from '../features/dashboard/hooks/useDashboard';
import StatsCard from '../features/dashboard/components/StatsCard';
import { SkeletonCard, SkeletonTable } from '../components/shared/Skeleton';
import StatusBadge from '../components/shared/StatusBadge';
import ErrorMessage from '../components/shared/ErrorMessage';
import LineChart from '../components/shared/charts/LineChart';
import DonutChart from '../components/shared/charts/DonutChart';
import { aggregateByMonth, aggregateByStatus, normalizeStatus, formatNumber } from '../utils/expenseAnalytics';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import styles from './DashboardPage.module.css';

const STATUS_COLORS = {
  pending: 'var(--color-warning)',
  approved: 'var(--color-success)',
  rejected: 'var(--color-danger)',
  paid: 'var(--color-info)',
  cancelled: 'var(--color-text-muted)',
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { stats, loading, error } = useDashboard();
  const { expenses, loading: expensesLoading } = useDashboardExpenses(100);

  const monthData = useMemo(() => (expenses.length ? aggregateByMonth(expenses) : null), [expenses]);
  const statusData = useMemo(() => {
    if (!expenses.length) return [];
    return aggregateByStatus(expenses);
  }, [expenses]);

  const recent = useMemo(() => expenses.slice(0, 6), [expenses]);

  const donutSegments = statusData.map((s) => ({
    value: s.value,
    color: STATUS_COLORS[s.status] || 'var(--color-text-muted)',
  }));

  const statusLabels = {
    pending: t('expenses.statusPending'),
    approved: t('expenses.statusApproved'),
    rejected: t('expenses.statusRejected'),
    paid: t('expenses.statusPaid'),
    cancelled: t('expenses.statusCancelled'),
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.kpiGrid}>
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} title />)}
        </div>
        <div className={styles.chartsGrid}>
          <SkeletonCard lines={5} />
          <SkeletonCard lines={5} />
        </div>
        <SkeletonTable />
      </div>
    );
  }

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <h2 className={styles.greetingTitle}>
          {t('dashboard.greeting')}, {user?.name || t('dashboard.user')}
          <span className={styles.wave}>👋</span>
        </h2>
        <p className={styles.greetingDesc}>{t('dashboard.description')}</p>
      </div>

      <div className={styles.kpiGrid}>
        <StatsCard
          title={t('dashboard.totalExpenses')}
          value={formatNumber(stats?.total)}
          color="var(--color-primary)"
          softColor="#E8F7F5"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
          sub={t('dashboard.requests')}
        />
        <StatsCard
          title={t('dashboard.approved')}
          value={formatNumber(stats?.approved)}
          color="var(--color-success)"
          softColor="#D1FAE5"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
          sub={`${formatCurrency(stats?.totalAmountApproved || 0)}`}
        />
        <StatsCard
          title={t('dashboard.pending')}
          value={formatNumber(stats?.pending)}
          color="var(--color-warning)"
          softColor="#FEF3C7"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
          sub={`${formatCurrency(stats?.totalAmountPending || 0)}`}
        />
        <StatsCard
          title={t('dashboard.totalAmount')}
          value={formatCurrency(stats?.totalAmount)}
          color="var(--color-info)"
          softColor="#DBEAFE"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M12 6v12" />
              <path d="M6 10v4" />
              <path d="M18 10v4" />
            </svg>
          }
          sub={t('dashboard.thisMonth')}
        />
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>{t('dashboard.evolution')}</h3>
              <p className={styles.cardSub}>{t('dashboard.byMonth')}</p>
            </div>
            <div className={styles.chip}>{t('dashboard.monthly')}</div>
          </div>
          {monthData && monthData.series.length ? (
            <div style={{ overflowX: 'auto' }}>
              <LineChart
                labels={monthData.labels}
                series={monthData.series}
                color="var(--color-primary)"
                height={240}
              />
            </div>
          ) : (
            <p className={styles.emptyChart}>{t('dashboard.emptyChart')}</p>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>{t('dashboard.byStatus')}</h3>
              <p className={styles.cardSub}>{t('dashboard.statusBreakdown')}</p>
            </div>
          </div>
          {donutSegments.length ? (
            <div className={styles.donutWrap}>
              <DonutChart
                segments={donutSegments}
                centerLabel={
                  <>
                    <span className={styles.donutTotal}>{formatCurrency(expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0))}</span>
                    <span className={styles.donutLabel}>{t('dashboard.total')}</span>
                  </>
                }
              />
              <div className={styles.legend}>
                {statusData.map((s) => (
                  <div key={s.status} className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: STATUS_COLORS[s.status] }} />
                    <span className={styles.legendLabel}>{statusLabels[s.status] || s.status}</span>
                    <span className={styles.legendValue}>{formatCurrency(s.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className={styles.emptyChart}>{t('dashboard.emptyChart')}</p>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>{t('dashboard.recentExpenses')}</h3>
            <p className={styles.cardSub}>{t('dashboard.latest')}</p>
          </div>
          <Link to="/expenses" className={styles.viewAll}>{t('dashboard.viewAll')}</Link>
        </div>
        {expensesLoading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : recent.length === 0 ? (
          <p className={styles.emptyChart}>{t('dashboard.noActivity')}</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('expenses.reference')}</th>
                  <th>{t('expenses.titleCol')}</th>
                  <th>{t('expenses.amount')}</th>
                  <th>{t('expenses.status')}</th>
                  <th>{t('expenses.date')}</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((e) => (
                  <tr key={e.reference || e.id}>
                    <td className={styles.refCell}>{e.reference}</td>
                    <td className={styles.titleCell}>{e.title}</td>
                    <td className={styles.amountCell}>{formatCurrency(e.amount)}</td>
                    <td>
                      <StatusBadge status={normalizeStatus(e.status)} />
                    </td>
                    <td className={styles.dateCell}>{formatDate(e.expense_date || e.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
