import { useUsers } from '../features/users/hooks/useUsers';
import PageHeader from '../components/shared/PageHeader';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import EmptyState from '../components/shared/EmptyState';
import { formatDate } from '../utils/formatDate';

function UsersPage() {
  const { users, loading, error } = useUsers();

  const columns = [
    { key: 'reference', label: 'Reference', width: '140px' },
    { key: 'name', label: 'Nom', render: (row) => <span style={{ fontWeight: 500 }}>{row.name}</span> },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (row) => (
        <Badge variant={row.role === 'admin' ? 'active' : 'default'}>
          {row.role === 'admin' ? 'Administrateur' : 'Employe'}
        </Badge>
      ),
    },
    { key: 'created_at', label: 'Date inscription', render: (row) => formatDate(row.created_at) },
  ];

  if (loading) return <Spinner fullPage />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      <PageHeader
        title="Utilisateurs"
        description="Liste des utilisateurs de la plateforme"
      />
      {users.length === 0 ? (
        <EmptyState title="Aucun utilisateur" message="Aucun utilisateur trouve." />
      ) : (
        <Table columns={columns} data={users} />
      )}
    </div>
  );
}

export default UsersPage;
