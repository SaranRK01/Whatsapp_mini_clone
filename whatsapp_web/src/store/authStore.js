import { create } from 'zustand';
import api from '../lib/axios';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('whatsapp_token') || null,
  isAuthenticated: !!localStorage.getItem('whatsapp_token'),
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/users/login', { username, password });
      const { token, ...userData } = response.data.data;
      
      localStorage.setItem('whatsapp_token', token);
      set({ user: userData, token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Login failed' 
      });
      return false;
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/users/register', { username, email, password });
      const { token, ...userData } = response.data.data;
      
      localStorage.setItem('whatsapp_token', token);
      set({ user: userData, token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Registration failed' 
      });
      return false;
    }
  },

  checkAuth: async () => {
    const currentToken = localStorage.getItem('whatsapp_token');
    if (!currentToken) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await api.get('/users/me');
      set({ user: response.data.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('whatsapp_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('whatsapp_token');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
