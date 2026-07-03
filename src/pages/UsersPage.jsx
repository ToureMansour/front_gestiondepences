import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const columns = [
    { key: 'reference', label: t('users.reference'), width: '140px' },
    { key: 'name', label: t('users.name'), render: (row) => <span style={{ fontWeight: 500 }}>{row.name}</span> },
    { key: 'email', label: t('users.email') },
    {
      key: 'role',
      label: t('users.role'),
      render: (row) => (
        <Badge variant={row.role === 'admin' ? 'active' : 'default'}>
          {row.role === 'admin' ? t('users.admin') : t('users.employee')}
        </Badge>
      ),
    },
    { key: 'created_at', label: t('users.dateRegistered'), render: (row) => formatDate(row.created_at) },
  ];

  if (loading) return <Spinner fullPage />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      <PageHeader
        title={t('users.title')}
        description={t('users.description')}
      />
      {users.length === 0 ? (
        <EmptyState title={t('users.emptyTitle')} message={t('users.emptyMessage')} />
      ) : (
        <Table columns={columns} data={users} />
      )}
    </div>
  );
}

export default UsersPage;
