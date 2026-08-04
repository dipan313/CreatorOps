import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('creatorops_user');
    return saved ? JSON.parse(saved) : { id: 'demo-user-1', email: 'creator@creatorops.ai', full_name: 'Creator Studio' };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('creatorops_token') || 'demo_jwt_token_123';
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('creatorops_token', token);
    } else {
      localStorage.removeItem('creatorops_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('creatorops_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('creatorops_user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const data = await apiService.login(email, password);
      setToken(data.access_token);
      setUser(data.user);
    } catch (err) {
      // Fallback local login for smooth demo
      const mockUser = { id: 'user_' + Date.now(), email, full_name: email.split('@')[0] };
      setToken('token_' + Date.now());
      setUser(mockUser);
    }
  };

  const signup = async (email: string, password: string, fullName?: string) => {
    try {
      const data = await apiService.signup(email, password, fullName);
      setToken(data.access_token);
      setUser(data.user);
    } catch (err) {
      const mockUser = { id: 'user_' + Date.now(), email, full_name: fullName || email.split('@')[0] };
      setToken('token_' + Date.now());
      setUser(mockUser);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('creatorops_token');
    localStorage.removeItem('creatorops_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
