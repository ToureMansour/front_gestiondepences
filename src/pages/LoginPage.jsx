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
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout title="Connexion">
      <LoginForm onSubmit={login} loading={loading} error={error} />
    </AuthLayout>
  );
}

export default LoginPage;
