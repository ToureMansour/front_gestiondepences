import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import styles from './ConfirmModal.module.css';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  danger = true,
  loading = false,
}) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || t('confirm.title')}>
      <div className={styles.body}>
        {message && <p className={styles.message}>{message}</p>}
        <div className={styles.actions}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel || t('confirm.cancel')}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? t('common.loading') : (confirmLabel || t('confirm.delete'))}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  danger: PropTypes.bool,
  loading: PropTypes.bool,
};
