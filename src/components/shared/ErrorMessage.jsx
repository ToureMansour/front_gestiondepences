import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button/Button';

function ErrorMessage({ message, onRetry }) {
  const { t } = useTranslation();
  const displayMessage = message || t('common.errorOccurred');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
    }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#DC2626', fontWeight: 500 }}>
        {displayMessage}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};

export default ErrorMessage;
