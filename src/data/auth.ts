// Authentication types and utilities
import { API_BASE_URL } from '@/config';
export interface User {
  id: string;
  email: string;
  password: string; // In production, this would be hashed
  name: string;
  company: string;
  phone: string;
  role: 'organizer' | 'provider' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  company: string;
  phone: string;
  role: 'organizer' | 'provider';
}

// API functions
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const result = await response.json();
    return result.data; // Extract user and token from data property
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    const result = await response.json();
    return result.data; // Extract user and token from data property
  },

  getCurrentUser: async (token: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user');
    }
    
    const result = await response.json();
    return result.data; // Extract user from data property
  },

  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  updateProfile: async (token: string, data: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Profile update failed');
    }
    
    const result = await response.json();
    return result.data;
  }
};

// Local storage utilities
export const authStorage = {
  getToken: (): string | null => localStorage.getItem('authToken'),
  setToken: (token: string): void => localStorage.setItem('authToken', token),
  getUser: (): User | null => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr || userStr === 'undefined') {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('currentUser'); // Clear corrupted data
      return null;
    }
  },
  setUser: (user: User): void => localStorage.setItem('currentUser', JSON.stringify(user)),
  clear: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }
};
