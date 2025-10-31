/**
 * Authentication API
 * API calls for user authentication
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 11:17 AM CST
 */

import apiClient from './client';
import { useAuthStore } from '../stores/auth.store';

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      role?: string;
      createdAt: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const { setUser, setTokens, setError } = useAuthStore.getState();
    
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      
      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        setUser(user);
        setTokens(accessToken, refreshToken);
        setError(null);
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      throw error;
    }
  },

  /**
   * Login user
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    const { setUser, setTokens, setError } = useAuthStore.getState();
    
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      
      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        setUser(user);
        setTokens(accessToken, refreshToken);
        setError(null);
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      setError(errorMessage);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    const { logout } = useAuthStore.getState();
    logout();
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get profile:', error);
      throw error;
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string) => {
    try {
      const response = await apiClient.post('/auth/refresh-token', { refreshToken });
      
      if (response.data.success) {
        const { accessToken: newAccessToken } = response.data.data;
        const { setTokens } = useAuthStore.getState();
        setTokens(newAccessToken, refreshToken);
        return response.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      authApi.logout();
      throw error;
    }
  }
};
