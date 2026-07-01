import { useState } from 'react';
import PageHeader from '../components/shared/PageHeader';
import { useExpenses, useAdminExpenses } from '../features/expenses/hooks/useExpenses';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import EmptyState from '../components/shared/EmptyState';
import { Modal } from '../components/ui/Modal';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import useAuthStore from '../store/authStore';

const STATUS_MAP = {
  pending: 'En attente',
  approved: 'Approuvee',
  rejected: 'Rejetee',
};

function ExpensesPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const { expenses, loading, error, approveExpense, rejectExpense } = isAdmin
    ? useAdminExpenses()
    : useExpenses();
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const columns = [
    { key: 'reference', label: 'Reference', width: '140px' },
    {
      key: 'title',
      label: 'Titre',
      render: (row) => (
        <span style={{ fontWeight: 500 }}>{row.title}</span>
      ),
    },
    {
      key: 'amount',
      label: 'Montant',
      render: (row) => formatCurrency(row.amount),
    },
    {
      key: 'status',
      label: 'Statut',
      render: (row) => (
        <Badge variant={row.status}>{STATUS_MAP[row.status] || row.status}</Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (row) => formatDate(row.created_at),
    },
  ];

  if (isAdmin) {
    columns.splice(1, 0, {
      key: 'user',
      label: 'Employe',
      render: (row) => row.user?.name || row.user_name || '-',
    });
    columns.push({
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          {(row.status === 'pending' || !row.status) && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); handleApprove(row.reference); }}
                disabled={actionLoading}
                style={{ color: '#059669' }}
              >
                Approuver
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); handleReject(row.reference); }}
                disabled={actionLoading}
                style={{ color: '#DC2626' }}
              >
                Rejeter
              </Button>
            </>
          )}
          {row.status !== 'pending' && row.status && (
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              {STATUS_MAP[row.status]}
            </span>
          )}
        </div>
      ),
    });
  }

  const handleApprove = async (ref) => {
    setActionLoading(true);
    await approveExpense(ref);
    setActionLoading(false);
  };

  const handleReject = async (ref) => {
    setActionLoading(true);
    await rejectExpense(ref);
    setActionLoading(false);
  };

  const handleRowClick = (row) => {
    setSelectedExpense(row);
    setDetailOpen(true);
  };

  if (loading) return <Spinner fullPage />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      <PageHeader
        title="Depenses"
        description={isAdmin ? 'Gerer les depenses des employes' : 'Mes depenses'}
      />
      {expenses.length === 0 ? (
        <EmptyState
          title="Aucune depense"
          message="Vous n'avez pas encore de depenses."
        />
      ) : (
        <Table
          columns={columns}
          data={expenses}
          onRowClick={handleRowClick}
        />
      )}

      <Modal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Detail de la depense"
      >
        {selectedExpense && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <strong style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Reference</strong>
              <span>{selectedExpense.reference}</span>
            </div>
            <div>
              <strong style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Titre</strong>
              <span>{selectedExpense.title}</span>
            </div>
            <div>
              <strong style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Description</strong>
              <span>{selectedExpense.description || 'Aucune description'}</span>
            </div>
            <div>
              <strong style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Montant</strong>
              <span style={{ fontWeight: 600 }}>{formatCurrency(selectedExpense.amount)}</span>
            </div>
            <div>
              <strong style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Statut</strong>
              <Badge variant={selectedExpense.status}>{STATUS_MAP[selectedExpense.status]}</Badge>
            </div>
            <div>
              <strong style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Date</strong>
              <span>{formatDate(selectedExpense.created_at)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ExpensesPage;
