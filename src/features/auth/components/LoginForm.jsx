import { useState } from 'react';
import PropTypes from 'prop-types';

function LoginForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFocus = (name) => setFocused((prev) => ({ ...prev, [name]: true }));
  const handleBlur = (name) => setFocused((prev) => ({ ...prev, [name]: false }));

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email invalide';
    if (!form.password) newErrors.password = 'Le mot de passe est requis';
    else if (form.password.length < 6) newErrors.password = 'Minimum 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const inputStyle = (name) => ({
    width: '100%',
    padding: '16px 16px 4px',
    border: `1.5px solid ${errors[name] ? '#DC2626' : focused[name] ? '#0F766E' : '#E2E8F0'}`,
    borderRadius: '10px',
    fontSize: '15px',
    fontFamily: "'Inter', sans-serif",
    color: '#1E293B',
    background: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused[name] ? '0 0 0 3px rgba(15,118,110,0.1)' : 'none',
    boxSizing: 'border-box',
    height: '52px',
  });

  const labelStyle = (name) => ({
    position: 'absolute',
    left: '14px',
    top: form[name] || focused[name] ? '6px' : '16px',
    fontSize: form[name] || focused[name] ? '11px' : '15px',
    fontWeight: form[name] || focused[name] ? 600 : 400,
    color: errors[name] ? '#DC2626' : focused[name] ? '#0F766E' : '#94A3B8',
    pointerEvents: 'none',
    transition: 'all 0.2s ease',
    background: '#fff',
    padding: '0 4px',
    lineHeight: 1,
  });

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Email */}
        <div style={{ position: 'relative' }}>
          <label style={labelStyle('email')}>Adresse email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onFocus={() => handleFocus('email')}
            onBlur={() => handleBlur('email')}
            style={inputStyle('email')}
            autoComplete="email"
          />
          {errors.email && (
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div style={{ position: 'relative' }}>
          <label style={labelStyle('password')}>Mot de passe</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            onFocus={() => handleFocus('password')}
            onBlur={() => handleBlur('password')}
            style={inputStyle('password')}
            autoComplete="current-password"
          />
          {errors.password && (
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.password}
            </p>
          )}
        </div>

        {/* Forgot password */}
        <div style={{ textAlign: 'right', marginTop: '-8px' }}>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#0F766E',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              padding: 0,
              transition: 'color 0.2s',
            }}
          >
            Mot de passe oublie ?
          </button>
        </div>

        {/* API Error */}
        {error && (
          <div style={{
            padding: '12px 16px',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ margin: 0, fontSize: '13px', color: '#991B1B', fontWeight: 500 }}>
              {error}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: loading ? '#94A3B8' : '#0F766E',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.25s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: loading ? 'none' : '0 4px 14px rgba(15,118,110,0.3)',
            marginTop: '4px',
            height: '50px',
          }}
          onMouseEnter={(e) => { if (!loading) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(15,118,110,0.4)'; } }}
          onMouseLeave={(e) => { if (!loading) { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 14px rgba(15,118,110,0.3)'; } }}
        >
          {loading ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
              </svg>
              Connexion en cours...
            </>
          ) : (
            <>
              Se connecter
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </>
          )}
        </button>

        {/* Demo hint */}
        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#94A3B8',
          margin: '8px 0 0',
        }}>
          Espace demo : admin@depensys.com / password
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default LoginForm;
