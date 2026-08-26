import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import authService from '../services/authService';
import { handleApiError } from '../../../services/errorHandler';

export function useAuth() {
  const navigate = useNavigate();
  const { user, isAuthenticated, setAuth, logout: storeLogout, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      const responseData = response.data.data || response.data;
      const { user, token } = responseData;
      setAuth(user, token);
      navigate('/dashboard');
      return true;
    } catch (err) {
      const appError = handleApiError(err);
      setError(appError.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [navigate, setAuth]);

  const register = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      const regData = response.data.data || response.data;
      const { user, token } = regData;
      setAuth(user, token);
      navigate('/dashboard');
      return true;
    } catch (err) {
      const appError = handleApiError(err);
      setError(appError.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [navigate, setAuth]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      storeLogout();
      navigate('/login');
    }
  }, [navigate, storeLogout]);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data.user || response.data);
    } catch {
      // silently fail
    }
  }, [setUser]);

  const updateProfile = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.updateProfile(data);
      setUser(response.data.user || response.data);
      return true;
    } catch (err) {
      const appError = handleApiError(err);
      setError(appError.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const changePassword = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      await authService.changePassword(data);
      return true;
    } catch (err) {
      const appError = handleApiError(err);
      setError(appError.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(data);
      return true;
    } catch (err) {
      const appError = handleApiError(err);
      setError(appError.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword(data);
      return true;
    } catch (err) {
      const appError = handleApiError(err);
      setError(appError.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    setError,
  };
}
