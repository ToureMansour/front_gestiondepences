import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function AuthLayout({ children, title }) {
  return (
    <div className="auth-split" style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#fff',
    }}>
      {/* ── Left panel: brand + illustration ── */}
      <div className="auth-left" style={{
        flex: '1.3',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(160deg, #0F172A 0%, #134E4A 35%, #0F766E 65%, #0D9488 100%)',
        padding: '60px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%)',
          top: '-200px',
          right: '-200px',
          animation: 'drift1 14s ease-in-out infinite',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15,118,110,0.12) 0%, transparent 70%)',
          bottom: '-100px',
          left: '-100px',
          animation: 'drift2 18s ease-in-out infinite',
          filter: 'blur(50px)',
        }} />
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(204,251,241,0.08) 0%, transparent 70%)',
          top: '30%',
          left: '20%',
          animation: 'drift1 12s ease-in-out infinite reverse',
          filter: 'blur(40px)',
        }} />

        {/* Content */}
        <div className="auth-left-content" style={{ position: 'relative', zIndex: 1, maxWidth: '480px', width: '100%' }}>
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            marginBottom: '48px',
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#CCFBF1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.5px',
            }}>
              Depensys
            </span>
          </Link>

          <p style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.65)',
            margin: '-32px 0 32px',
            textAlign: 'center',
            lineHeight: '1.5',
          }}>
            La solution intelligente pour gerer<br />
            les notes de frais de votre entreprise
          </p>

          <div className="auth-illustration">
            <WalletIllustration />
          </div>


        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="auth-right" style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 48px',
        background: '#fff',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          animation: 'slideUp 0.6s ease',
        }}>
          <h2 className="auth-title" style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#0F172A',
            margin: '0 0 6px',
            letterSpacing: '-0.5px',
          }}>
            {title || 'Bienvenue'}
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#64748B',
            margin: '0 0 36px',
          }}>
            Connectez-vous pour acceder a votre espace
          </p>

          {children}
        </div>
      </div>

      <style>{`
        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 30px) scale(1.05); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1000px) {
          .auth-split { 
            flex-direction: column !important; 
            background: linear-gradient(160deg, #0F172A 0%, #134E4A 35%, #0F766E 65%, #0D9488 100%) !important;
            min-height: 100vh !important;
            justify-content: flex-start !important;
          }
          .auth-left { 
            flex: none !important; 
            padding: 40px 24px 0 !important;
            min-height: auto !important;
            background: none !important;
          }
          .auth-left-content { 
            max-width: 100% !important;
            text-align: center !important;
          }
          .auth-left-content > p { display: none !important; }
          .auth-left-content > a { margin-bottom: 0 !important; }
          .auth-illustration { display: none !important; }
          .auth-right { 
            flex: 1 !important;
            padding: 32px 24px 48px !important;
            background: transparent !important;
            align-items: flex-start !important;
          }
          .auth-right > div {
            background: #fff !important;
            border-radius: 16px !important;
            padding: 32px !important;
            box-shadow: 0 8px 40px rgba(0,0,0,0.15) !important;
            max-width: 100% !important;
          }
          .auth-title { font-size: 24px !important; }
          .auth-right p { margin-bottom: 24px !important; }
        }
        @media (max-width: 480px) {
          .auth-left { padding: 28px 16px 0 !important; }
          .auth-right { padding: 20px 16px 40px !important; }
          .auth-right > div { padding: 24px !important; }
          .auth-title { font-size: 22px !important; }
        }
      `}</style>
    </div>
  );
}

function WalletIllustration() {
  return (
    <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '400px', height: 'auto' }}>
      <defs>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
        <linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <filter id="shadow1">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
        </filter>
        <filter id="shadow2">
          <feDropShadow dx="0" dy="6" stdDeviation="12" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Subtle background circle */}
      <circle cx="200" cy="140" r="120" fill="rgba(204,251,241,0.06)" />

      {/* Wallet body */}
      <rect x="60" y="100" width="280" height="160" rx="20" fill="url(#walletGrad)" filter="url(#shadow2)" />

      {/* Wallet stitching */}
      <rect x="70" y="110" width="260" height="140" rx="14" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 3" fill="none" />

      {/* Wallet flap fold line */}
      <line x1="60" y1="160" x2="340" y2="160" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* Card peeking out */}
      <g filter="url(#shadow1)">
        <rect x="80" y="72" width="240" height="150" rx="14" fill="url(#cardGrad)" />
        <rect x="80" y="72" width="240" height="150" rx="14" fill="url(#cardGrad)" opacity="0.3" />
      </g>

      {/* Card chip */}
      <rect x="110" y="96" width="36" height="26" rx="4" fill="rgba(255,255,255,0.25)" />
      <rect x="114" y="100" width="28" height="18" rx="2" fill="rgba(255,255,255,0.1)" />

      {/* Card brand logo placeholder */}
      <circle cx="290" cy="100" r="10" fill="rgba(255,255,255,0.2)" />
      <circle cx="280" cy="100" r="10" fill="rgba(255,255,255,0.15)" />

      {/* Card number dots */}
      <text x="110" y="158" fill="rgba(255,255,255,0.6)" fontSize="14" fontFamily="monospace" letterSpacing="4">
        4242  ••••  ••••  4242
      </text>

      {/* Card holder */}
      <text x="110" y="186" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="sans-serif" letterSpacing="1">
        TITULAIRE
      </text>
      <text x="110" y="202" fill="rgba(255,255,255,0.75)" fontSize="13" fontFamily="sans-serif" fontWeight="600">
        DEPENSYS PRO
      </text>

      {/* Card expiry */}
      <text x="270" y="186" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="sans-serif" letterSpacing="1">
        EXPIRATION
      </text>
      <text x="270" y="202" fill="rgba(255,255,255,0.75)" fontSize="13" fontFamily="sans-serif" fontWeight="600">
        12/28
      </text>

      {/* Coins floating */}
      <g>
        <circle cx="80" cy="240" r="12" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
        <text x="76" y="244" fill="#92400E" fontSize="9" fontWeight="700">$</text>
      </g>
      <g style={{ animation: 'coinFloat 3s ease-in-out infinite' }}>
        <circle cx="320" cy="230" r="10" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
        <text x="317" y="234" fill="#92400E" fontSize="8" fontWeight="700">$</text>
      </g>
      <g style={{ animation: 'coinFloat 3.5s ease-in-out infinite 0.5s' }}>
        <circle cx="295" cy="248" r="9" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
        <text x="292" y="251" fill="#92400E" fontSize="7" fontWeight="700">$</text>
      </g>

      {/* Green check mark */}
      <g transform="translate(260, 84)">
        <circle cx="10" cy="10" r="10" fill="#059669" />
        <path d="M6 10l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* Rising graph line */}
      <polyline
        points="60,265 120,260 160,240 210,245 260,220 310,225 340,200"
        stroke="rgba(45,212,191,0.3)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="340" cy="200" r="3" fill="#2DD4BF" />

      <style>{`
        @keyframes coinFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </svg>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default AuthLayout;
