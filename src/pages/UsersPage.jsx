import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import ConfirmModal from '../components/shared/ConfirmModal';
import { useUsers } from '../features/users/hooks/useUsers';
import { Pagination } from '../components/ui/Pagination';
import ErrorMessage from '../components/shared/ErrorMessage';
import { SkeletonTable } from '../components/shared/Skeleton';
import { useToast } from '../components/shared/Toast';
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

const EMPTY_FORM = { name: '', email: '', role: 'employee', password: '' };

function UsersPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { users, loading, error, pagination, fetchUsers, createUser, updateUser, deleteUser } = useUsers();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchUsers(page); }, [page, fetchUsers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchQ = !q || (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
      const matchRole = !roleFilter || u.role === roleFilter;
      return matchQ && matchRole;
    });
  }, [users, query, roleFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({ name: u.name || '', email: u.email || '', role: u.role || 'employee', password: '' });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = t('common.required');
    if (!form.email.trim()) {
      errors.email = t('common.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = t('common.invalidEmail');
    }
    if (!editing && !form.password) {
      errors.password = t('common.required');
    } else if (form.password && form.password.length < 6) {
      errors.password = t('profile.passwordMin6');
    }
    return errors;
  };

  const handleSave = async () => {
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
    };
    if (form.password) payload.password = form.password;

    let result;
    if (editing) {
      result = await updateUser(editing.reference || editing.id, payload);
    } else {
      result = await createUser(payload);
    }

    setSaving(false);
    if (result.success) {
      showToast(editing ? t('toast.userUpdated') : t('toast.userAdded'));
      setModalOpen(false);
      fetchUsers(page);
    } else {
      showToast(result.error || t('common.errorOccurred'), 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteUser(deleteTarget.reference || deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    if (result.success) {
      showToast(t('toast.userDeleted'));
      fetchUsers(page);
    } else {
      showToast(result.error || t('common.errorOccurred'), 'error');
    }
  };

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
        <Button className={styles.addBtn} onClick={openAdd}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t('users.addUser')}
        </Button>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <SkeletonTable rows={7} cols={5} />
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
                  <th className={styles.actionsCol}>{t('users.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.reference || u.id}>
                    <td>
                      <div className={styles.userCell}>
                        <div>
                          <p className={styles.userName}>{u.name}</p>
                          <p className={styles.userRef}>{u.reference}</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.emailCell}>{u.email}</td>
                    <td><RoleBadge role={u.role} /></td>
                    <td className={styles.dateCell}>{formatDate(u.created_at)}</td>
                    <td className={styles.actionsCol}>
                      <div className={styles.rowActions}>
                        <button className={`${styles.actionBtn} ${styles.edit}`} onClick={() => openEdit(u)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                          {t('users.edit')}
                        </button>
                        <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => setDeleteTarget(u)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                          {t('users.delete')}
                        </button>
                      </div>
                    </td>
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

      <Modal
        isOpen={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editing ? t('users.editTitle') : t('users.addTitle')}
      >
        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>{t('users.name')} *</label>
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('users.namePlaceholder')}
              autoFocus
            />
            {formErrors.name && <span className={styles.errorText}>{formErrors.name}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('users.email')} *</label>
            <input
              className={styles.input}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t('users.emailPlaceholder')}
            />
            {formErrors.email && <span className={styles.errorText}>{formErrors.email}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('users.role')} *</label>
            <select
              className={styles.input}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="admin">{t('users.admin')}</option>
              <option value="manager">{t('users.manager')}</option>
              <option value="employee">{t('users.employee')}</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              {t('profile.password')} {editing ? '' : '*'}
            </label>
            <input
              className={styles.input}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={t('users.passwordPlaceholder')}
            />
            {editing && !form.password && <span className={styles.hint}>{t('users.passwordOptionalHint')}</span>}
            {formErrors.password && <span className={styles.errorText}>{formErrors.password}</span>}
          </div>
          <div className={styles.actions}>
            <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={saving}>{t('users.cancel')}</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? t('users.saving') : t('users.save')}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={t('users.deleteConfirmTitle')}
        message={t('users.deleteConfirmMessage')}
        confirmLabel={t('users.delete')}
      />
    </div>
  );
}

export default UsersPage;