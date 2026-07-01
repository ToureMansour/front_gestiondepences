import PropTypes from 'prop-types';

function AuthLayout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F1F5F9',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#0F766E',
            margin: 0,
            letterSpacing: '-0.5px',
          }}>
            Depensys
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#64748B',
            margin: '4px 0 0',
          }}>
            Gestion des depenses
          </p>
        </div>
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1px solid #E2E8F0',
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
