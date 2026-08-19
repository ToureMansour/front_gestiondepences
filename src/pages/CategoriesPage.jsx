import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import ConfirmModal from '../components/shared/ConfirmModal';
import { useToast } from '../components/shared/Toast';
import { getCategories, saveCategories, generateId } from '../utils/categoryStore';
import styles from './CategoriesPage.module.css';

function CategoriesPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [categories, setCategories] = useState(() => getCategories());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const displayName = (c) => (c.isDefault ? t(c.name) : c.name);

  const openAdd = () => {
    setEditing(null);
    setName('');
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setName(c.isDefault ? t(c.name) : c.name);
    setModalOpen(true);
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    let next;
    if (editing) {
      next = categories.map((c) =>
        c.id === editing.id ? { ...c, name: trimmed, isDefault: false } : c
      );
    } else {
      next = [...categories, { id: generateId(), name: trimmed, isDefault: false }];
    }
    saveCategories(next);
    setCategories(next);
    setModalOpen(false);
    showToast(editing ? t('toast.categoryUpdated') : t('toast.categoryAdded'));
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const next = categories.filter((c) => c.id !== deleteTarget.id);
    saveCategories(next);
    setCategories(next);
    setDeleteTarget(null);
    showToast(t('toast.categoryDeleted'));
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Button onClick={openAdd}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t('categories.addCategory')}
        </Button>
      </div>

      <div className={styles.tableCard}>
        {categories.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>
            </div>
            <h3 className={styles.emptyTitle}>{t('categories.emptyTitle')}</h3>
            <p className={styles.emptyMessage}>{t('categories.emptyMessage')}</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('categories.name')}</th>
                  <th>{t('categories.nbExpenses')}</th>
                  <th>{t('categories.totalAmount')}</th>
                  <th className={styles.actionsCol}>{t('expenses.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className={styles.nameCell}>
                        <div className={styles.catIcon}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>
                        </div>
                        <span className={styles.nameText}>{displayName(c)}</span>
                      </div>
                    </td>
                    <td className={styles.countCell}>0</td>
                    <td className={styles.amountCell}>0,00 €</td>
                    <td className={styles.actionsCol}>
                      <div className={styles.rowActions}>
                        <button className={`${styles.actionBtn} ${styles.edit}`} onClick={() => openEdit(c)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                          {t('categories.edit')}
                        </button>
                        <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => setDeleteTarget(c)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                          {t('categories.delete')}
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t('categories.editTitle') : t('categories.addTitle')}
      >
        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>{t('categories.name')} *</label>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('categories.namePlaceholder')}
              autoFocus
            />
          </div>
          <div className={styles.actions}>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>{t('categories.cancel')}</Button>
            <Button onClick={handleSave} disabled={!name.trim()}>{t('categories.save')}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('categories.deleteConfirmTitle')}
        message={t('categories.deleteConfirmMessage')}
        confirmLabel={t('categories.delete')}
      />
    </div>
  );
}

export default CategoriesPage;
