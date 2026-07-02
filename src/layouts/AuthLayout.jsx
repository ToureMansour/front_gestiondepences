import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function AuthLayout({ children, title }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F172A 0%, #134E4A 30%, #0F766E 60%, #0D9488 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 148, 136, 0.2) 0%, transparent 70%)',
        top: '-150px',
        right: '-100px',
        animation: 'blob 12s ease-in-out infinite',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(15, 118, 110, 0.15) 0%, transparent 70%)',
        bottom: '-100px',
        left: '-80px',
        animation: 'blob2 15s ease-in-out infinite',
        filter: 'blur(60px)',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.6s ease',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CCFBF1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#fff',
              margin: 0,
              letterSpacing: '-0.5px',
            }}>
              Depensys
            </h1>
          </Link>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.6)',
            margin: '4px 0 0',
          }}>
            Gestion des depenses
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          padding: '36px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}>
          {title && (
            <h2 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#1E293B',
              margin: '0 0 24px',
              textAlign: 'center',
            }}>
              {title}
            </h2>
          )}
          {children}
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '24px',
        }}>
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Retour a l accueil
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -40px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(40px, 30px) scale(1.02); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, -30px) scale(1.08); }
          66% { transform: translate(20px, 40px) scale(0.92); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default AuthLayout;
