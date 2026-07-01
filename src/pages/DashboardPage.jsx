import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import StatsCard from '../features/dashboard/components/StatsCard';
import PageHeader from '../components/shared/PageHeader';
import Spinner from '../components/ui/Spinner/Spinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import { formatCurrency } from '../utils/formatCurrency';
import useAuthStore from '../store/authStore';

function DashboardPage() {
  const { user } = useAuthStore();
  const { stats, loading, error } = useDashboard();

  if (loading) return <Spinner fullPage />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      <PageHeader
        title={`Bonjour, ${user?.name || 'Utilisateur'}`}
        description="Voici un apercu de vos depenses."
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
      }}>
        <StatsCard
          title="Total depenses"
          value={stats?.total || 0}
          color="#0F766E"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
        <StatsCard
          title="Approuvees"
          value={stats?.approved || 0}
          color="#059669"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
        />
        <StatsCard
          title="En attente"
          value={stats?.pending || 0}
          color="#D97706"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />
        <StatsCard
          title="Montant total"
          value={formatCurrency(stats?.totalAmount || 0)}
          color="#0284C7"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M12 6v12" />
              <path d="M6 10v4" />
              <path d="M18 10v4" />
            </svg>
          }
        />
      </div>
    </div>
  );
}

export default DashboardPage;
