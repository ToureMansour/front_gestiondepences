import { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from '../../i18n';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const t = (key) => {
        const keys = key.split('.');
        let val = i18n.getResourceBundle(i18n.language, 'translation');
        for (const k of keys) {
          if (val) val = val[k];
        }
        return val || key;
      };

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          padding: '48px 24px',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
            {t('common.errorOccurred')}
          </h2>
          <p style={{ color: '#64748B', marginBottom: '16px' }}>
            {t('common.errorMessage')}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '10px 20px',
              background: '#0F766E',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {t('common.retry')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
