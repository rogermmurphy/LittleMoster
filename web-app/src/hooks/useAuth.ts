/**
 * useAuth Hook
 * Custom hook for authentication operations
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 11:18 AM CST
 */

import { useAuthStore } from '../stores/auth.store';
import { authApi, LoginData, RegisterData } from '../api/auth.api';

export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    setLoading,
    clearError 
  } = useAuthStore();

  const login = async (data: LoginData) => {
    setLoading(true);
    clearError();
    try {
      await authApi.login(data);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    clearError();
    try {
      await authApi.register(data);
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout
  };
};
