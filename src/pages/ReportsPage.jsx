import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDashboardExpenses } from '../features/dashboard/hooks/useDashboard';
import { Button } from '../components/ui/Button';
import StatsCard from '../features/dashboard/components/StatsCard';
import { SkeletonCard } from '../components/shared/Skeleton';
import ErrorMessage from '../components/shared/ErrorMessage';
import LineChart from '../components/shared/charts/LineChart';
import DonutChart from '../components/shared/charts/DonutChart';
import { useToast } from '../components/shared/Toast';
import {
  aggregateByMonth,
  aggregateByStatus,
  aggregateByUser,
  totalAmountOf,
  normalizeStatus,
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

function downloadCsv(filename, rows) {
  const content = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ReportsPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
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

  const handleExport = () => {
    const rows = [
      ['Reference', 'Title', 'Amount', 'Status', 'Date'],
      ...expenses.map((e) => [
        e.reference,
        e.title,
        e.amount,
        normalizeStatus(e.status),
        e.expense_date || e.created_at || '',
      ]),
    ];
    downloadCsv('depensys-expenses.csv', rows);
    showToast(t('toast.reportDownloaded'));
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
        <Button variant="secondary" onClick={handleExport} disabled={!expenses.length}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          {t('reports.exportCsv')}
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
