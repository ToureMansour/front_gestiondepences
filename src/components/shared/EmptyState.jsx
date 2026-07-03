import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

function EmptyState({
  icon = 'empty',
  title,
  message,
  action,
}) {
  const { t } = useTranslation();
  const displayTitle = title || t('common.noData');
  const displayMessage = message || t('common.noInfo');

  const renderIcon = () => {
    if (icon === 'empty') {
      return (
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <polyline points="13 2 13 9 20 9" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
    }}>
      <div style={{ marginBottom: '16px', opacity: 0.6 }}>
        {renderIcon()}
      </div>
      <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600, color: '#475569' }}>
        {displayTitle}
      </h3>
      <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#94A3B8', maxWidth: '360px' }}>
        {displayMessage}
      </p>
      {action && action}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  action: PropTypes.node,
};

EmptyState.defaultProps = {
  icon: 'empty',
};

export default EmptyState;
