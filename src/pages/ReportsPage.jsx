import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDashboardExpenses } from '../features/dashboard/hooks/useDashboard';
import { useSettings } from '../features/settings/hooks/useSettings';
import { Button } from '../components/ui/Button';
import StatsCard from '../features/dashboard/components/StatsCard';
import { SkeletonCard } from '../components/shared/Skeleton';
import ErrorMessage from '../components/shared/ErrorMessage';
import LineChart from '../components/shared/charts/LineChart';
import DonutChart from '../components/shared/charts/DonutChart';
import { useToast } from '../components/shared/Toast';
import { exportExpensesPdf, exportExpensesXlsx } from '../features/reports/reportsExport';
import {
  aggregateByMonth,
  aggregateByStatus,
  aggregateByUser,
  totalAmountOf,
  formatNumber,
} from '../utils/expenseAnalytics';
import { formatCurrency } from '../utils/formatCurrency';
import styles from './ReportsPage.module.css';

const STATUS_COLORS = {
  pending: 'var(--color-warning)',
  approved: 'var(--color-success)',
  rejected: 'var(--color-danger)',
  paid: 'var(--color-info)',
  cancelled: 'var(--color-text-muted)',
};

function ReportsPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { settings } = useSettings();
  const { expenses, loading, error } = useDashboardExpenses(100);

  const monthData = useMemo(() => (expenses.length ? aggregateByMonth(expenses) : null), [expenses]);
  const statusData = useMemo(() => (expenses.length ? aggregateByStatus(expenses) : []), [expenses]);
  const topUsers = useMemo(() => (expenses.length ? aggregateByUser(expenses) : []), [expenses]);
  const total = useMemo(() => totalAmountOf(expenses), [expenses]);

  const statusLabels = {
    pending: t('expenses.statusPending'),
    approved: t('expenses.statusApproved'),
    rejected: t('expenses.statusRejected'),
    paid: t('expenses.statusPaid'),
    cancelled: t('expenses.statusCancelled'),
  };

  const exportLabels = {
    reportTitle: t('reports.reportTitle'),
    generatedOn: t('reports.generatedOn'),
    employee: t('expenses.employee'),
    email: t('users.email'),
    date: t('expenses.date'),
    title: t('expenses.titleCol'),
    category: t('expenses.category'),
    amount: t('expenses.amount'),
    status: t('expenses.status'),
    total: t('reports.totalLabel'),
    pending: t('expenses.statusPending'),
    approved: t('expenses.statusApproved'),
    rejected: t('expenses.statusRejected'),
    paid: t('expenses.statusPaid'),
    cancelled: t('expenses.statusCancelled'),
  };

  const handleExportPdf = async () => {
    if (!expenses.length) return;
    try {
      await exportExpensesPdf({
        expenses,
        orgName: settings.organization_name || t('sidebar.appName'),
        labels: exportLabels,
      });
      showToast(t('toast.reportDownloaded'));
    } catch {
      showToast(t('common.errorOccurred'), 'error');
    }
  };

  const handleExportExcel = async () => {
    if (!expenses.length) return;
    try {
      await exportExpensesXlsx({
        expenses,
        orgName: settings.organization_name || t('sidebar.appName'),
        labels: {
          ...exportLabels,
          summary: t('reports.summaryTitle'),
          byEmployee: t('reports.byEmployee'),
          grandTotal: t('reports.grandTotal'),
          expenseCount: t('reports.expenseCount'),
        },
      });
      showToast(t('toast.reportDownloaded'));
    } catch {
      showToast(t('common.errorOccurred'), 'error');
    }
  };

  const maxUserValue = topUsers.length ? topUsers[0].value : 1;

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.kpiGrid}>
          <SkeletonCard title />
          <SkeletonCard title />
          <SkeletonCard title />
        </div>
        <div className={styles.grid}>
          <SkeletonCard lines={5} />
          <SkeletonCard lines={5} />
        </div>
      </div>
    );
  }

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Button variant="secondary" onClick={handleExportPdf} disabled={!expenses.length}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          {t('reports.exportPdf')}
        </Button>
        <Button onClick={handleExportExcel} disabled={!expenses.length}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /></svg>
          {t('reports.exportExcel')}
        </Button>
      </div>

      <div className={styles.kpiGrid}>
        <StatsCard
          title={t('reports.totalExpenses')}
          value={formatNumber(expenses.length)}
          color="var(--color-primary)"
          softColor="#E8F7F5"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          }
        />
        <StatsCard
          title={t('reports.totalAmount')}
          value={formatCurrency(total)}
          color="var(--color-info)"
          softColor="#DBEAFE"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M12 6v12" /><path d="M6 10v4" /><path d="M18 10v4" /></svg>
          }
        />
        <StatsCard
          title={t('reports.statuses')}
          value={statusData.length}
          color="var(--color-purple)"
          softColor="#EDE9FE"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
          }
        />
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{t('reports.evolution')}</h3>
          {monthData && monthData.series.length ? (
            <LineChart labels={monthData.labels} series={monthData.series} color="var(--color-primary)" height={240} />
          ) : (
            <p className={styles.emptyChart}>{t('reports.emptyMessage')}</p>
          )}
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{t('reports.distribution')}</h3>
          {statusData.length ? (
            <div className={styles.donutWrap}>
              <DonutChart
                size={150}
                thickness={18}
                segments={statusData.map((s) => ({ value: s.value, color: STATUS_COLORS[s.status] || 'var(--color-text-muted)' }))}
                centerLabel={<span className={styles.donutTotal}>{formatCurrency(total)}</span>}
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
            <p className={styles.emptyChart}>{t('reports.emptyMessage')}</p>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{t('reports.topUsers')}</h3>
        {topUsers.length ? (
          <div className={styles.rankings}>
            {topUsers.slice(0, 5).map((u, i) => (
              <div key={u.name} className={styles.rankRow}>
                <span className={`${styles.rank} ${i === 0 ? styles.rankFirst : ''}`}>{i + 1}</span>
                <div className={styles.rankInfo}>
                  <div className={styles.rankTop}>
                    <span className={styles.rankName}>{u.name}</span>
                    <span className={styles.rankValue}>{formatCurrency(u.value)}</span>
                  </div>
                  <div className={styles.rankBar}>
                    <div className={styles.rankFill} style={{ width: `${(u.value / maxUserValue) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyChart}>{t('reports.emptyMessage')}</p>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;
