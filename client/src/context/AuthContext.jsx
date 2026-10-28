import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('dmecs_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.get('/auth/me')
      .then((res) => {
        if (res.success) {
          setUser(res.data);
        }
      })
      .catch(() => {
        localStorage.removeItem('dmecs_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success) {
      localStorage.setItem('dmecs_token', res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.error || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.success) {
      localStorage.setItem('dmecs_token', res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.error || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('dmecs_token');
    setUser(null);
  };

  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAtLeast = (minRole) => {
    if (!user) return false;
    const hierarchy = {
      'Super Admin': 8,
      'State Admin': 7,
      'District Admin': 6,
      'EOC Operator': 5,
      'NGO Admin': 4,
      'Field Officer': 3,
      'Volunteer': 2,
      'Public User': 1,
    };
    return (hierarchy[user.role] || 0) >= (hierarchy[minRole] || 0);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, hasRole, isAtLeast }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
