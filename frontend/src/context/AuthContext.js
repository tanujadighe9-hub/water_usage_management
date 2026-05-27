import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('aquatrack_token');
    const saved  = localStorage.getItem('aquatrack_user');
    if (token && saved) {
      setUser(JSON.parse(saved));
      api.get('/auth/me')
        .then(r => { setUser(r.data.user); localStorage.setItem('aquatrack_user', JSON.stringify(r.data.user)); })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('aquatrack_token', token);
    localStorage.setItem('aquatrack_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('aquatrack_token');
    localStorage.removeItem('aquatrack_user');
    setUser(null);
  };

  const refreshUser = async () => {
    const r = await api.get('/auth/me');
    setUser(r.data.user);
    localStorage.setItem('aquatrack_user', JSON.stringify(r.data.user));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
