import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import AuthLayout from '../layouts/AuthLayout';
import LoginForm from '../features/auth/components/LoginForm';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useEffect } from 'react';

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { login, loading, error } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 700,
        color: '#1E293B',
        margin: '0 0 24px',
        textAlign: 'center',
      }}>
        Connexion
      </h2>
      <LoginForm onSubmit={login} loading={loading} error={error} />
    </AuthLayout>
  );
}

export default LoginPage;
