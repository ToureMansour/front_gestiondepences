import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/Badge';
import styles from './StatusBadge.module.css';

const VARIANT_MAP = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  paid: 'active',
  cancelled: 'default',
  active: 'active',
  inactive: 'default',
};

const STATUS_KEYS = {
  pending: 'expenses.statusPending',
  approved: 'expenses.statusApproved',
  rejected: 'expenses.statusRejected',
  paid: 'expenses.statusPaid',
  cancelled: 'expenses.statusCancelled',
};

export default function StatusBadge({ status }) {
  const { t } = useTranslation();
  if (!status) return null;
  const normalized = String(status).toLowerCase();
  const variant = VARIANT_MAP[normalized] || 'default';
  const label = STATUS_KEYS[normalized]
    ? t(STATUS_KEYS[normalized])
    : status;
  return (
    <span className={styles.badgeWrap}>
      <Badge variant={variant}>{label}</Badge>
    </span>
  );
}
