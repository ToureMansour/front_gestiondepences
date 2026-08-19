import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import expenseService from '../features/expenses/services/expenseService';
import { handleApiError } from '../services/errorHandler';
import { Button } from '../components/ui/Button';
import StatusBadge from '../components/shared/StatusBadge';
import ConfirmModal from '../components/shared/ConfirmModal';
import ErrorMessage from '../components/shared/ErrorMessage';
import { useToast } from '../components/shared/Toast';
import { SkeletonCard } from '../components/shared/Skeleton';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate, formatDateTime } from '../utils/formatDate';
import { normalizeStatus } from '../utils/expenseAnalytics';
import { API_BASE_URL } from '../constants/api';
import styles from './ExpenseDetailPage.module.css';

const STORAGE_ORIGIN = new URL(API_BASE_URL).origin;

function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldValue}>{children}</span>
    </div>
  );
}

function ExpenseDetailPage() {
  const { reference } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchExpense = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await expenseService.getByReference(reference);
      const body = response.data;
      setExpense(body.data || body);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpense(); }, [reference]);

  const handleApprove = async () => {
    setActionLoading(true);
    const response = await expenseService.approve(reference);
    const body = response.data;
    setExpense(body.data || body);
    setActionLoading(false);
    showToast(t('toast.expenseApproved'));
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const response = await expenseService.reject(reference, t('expenses.defaultRejectReason'));
      const body = response.data;
      setExpense(body.data || body);
      setRejectOpen(false);
      showToast(t('toast.expenseRejected'));
    } catch {
      showToast(t('common.errorOccurred'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <SkeletonCard lines={6} title />
      </div>
    );
  }

  if (error) return <ErrorMessage message={error.message} onRetry={fetchExpense} />;

  const status = normalizeStatus(expense?.status);

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/expenses')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        {t('expenses.backToExpenses')}
      </button>

      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>{expense.title}</h2>
          <p className={styles.ref}>{expense.reference}</p>
        </div>
        <div className={styles.headRight}>
          <StatusBadge status={status} />
          <span className={styles.amount}>{formatCurrency(expense.amount)}</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{t('expenses.information')}</h3>
          <div className={styles.fields}>
            <Field label={t('expenses.titleCol')}>{expense.title}</Field>
            <Field label={t('expenses.descriptionLabel')}>
              {expense.description || t('expenses.noDescription')}
            </Field>
            <Field label={t('expenses.amount')}>
              <strong className={styles.amountStrong}>{formatCurrency(expense.amount)}</strong>
            </Field>
            <Field label={t('expenses.date')}>{formatDate(expense.expense_date || expense.created_at)}</Field>
            <Field label={t('expenses.status')}>
              <StatusBadge status={status} />
            </Field>
            {isAdmin && (
              <Field label={t('expenses.employee')}>
                <div className={styles.userCell}>
                  <div className={styles.userAvatar}>
                    {(expense.user?.name || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <span>{expense.user?.name || '—'}</span>
                </div>
              </Field>
            )}
            <Field label={t('expenses.createdAt')}>{formatDateTime(expense.created_at)}</Field>
            {status === 'rejected' && expense.rejection_reason && (
              <Field label={t('expenses.rejectionReason')}>
                <span className={styles.rejectionReason}>{expense.rejection_reason}</span>
              </Field>
            )}
            {status === 'paid' && (
              <Field label={t('expenses.paidAt')}>
                {expense.payment_method ? `${expense.payment_method} — ` : ''}
                {formatDateTime(expense.paid_at)}
              </Field>
            )}
          </div>
        </div>

        <div className={styles.side}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>{t('expenses.proof')}</h3>
            {expense.proof_file_path ? (
              <a
                className={styles.proofLink}
                href={`${STORAGE_ORIGIN}/storage/${expense.proof_file_path}`}
                target="_blank"
                rel="noreferrer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                {t('expenses.download')}
              </a>
            ) : (
              <p className={styles.noProof}>{t('expenses.noDescription')}</p>
            )}
          </div>

          {isAdmin && status === 'pending' && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>{t('expenses.actions')}</h3>
              <div className={styles.adminActions}>
                <Button onClick={handleApprove} disabled={actionLoading}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  {t('expenses.approve')}
                </Button>
                <Button variant="danger" onClick={() => setRejectOpen(true)} disabled={actionLoading}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  {t('expenses.reject')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
        title={t('expenses.reject')}
        message={t('expenses.rejectConfirm', { ref: expense.reference })}
        confirmLabel={t('expenses.reject')}
        loading={actionLoading}
      />
    </div>
  );
}

export default ExpenseDetailPage;
