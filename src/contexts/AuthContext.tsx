import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, authAPI, authStorage } from '@/data/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    company: string;
    phone: string;
    role: 'organizer' | 'provider';
  }) => Promise<void>;
  socialLogin: (provider: 'google' | 'facebook', token: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start as true while checking storage
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing auth on mount
  useEffect(() => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();

    if (token && user) {
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });
    } else {
      // Clear any corrupted data and stop loading
      authStorage.clear();
      dispatch({ type: 'AUTH_FAILURE' });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const { user, token } = await authAPI.login({ email, password });
      
      // Store in localStorage
      authStorage.setToken(token);
      authStorage.setUser(user);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    name: string;
    company: string;
    phone: string;
    role: 'organizer' | 'provider';
  }) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const { user, token } = await authAPI.register(data);
      
      // Store in localStorage
      authStorage.setToken(token);
      authStorage.setUser(user);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  const socialLogin = async (provider: 'google' | 'facebook', token: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const { user, token: authToken } = await authAPI.socialLogin(provider, token);
      
      authStorage.setToken(authToken);
      authStorage.setUser(user);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token: authToken },
      });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    dispatch({ type: 'LOGOUT' });
    // Force a full page reload to clear all states and redirect to login
    window.location.href = '/login';
  };

  const updateUser = (user: User) => {
    authStorage.setUser(user);
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    socialLogin,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
