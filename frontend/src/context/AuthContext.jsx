import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('dermai_token');
    const u = localStorage.getItem('dermai_user');
    if (t && u) {
      setUser(JSON.parse(u));
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    }
    setLoading(false);
  }, []);

  const save = (token, userData) => {
    setUser(userData);
    localStorage.setItem('dermai_token', token);
    localStorage.setItem('dermai_user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    save(data.token, data.user);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    save(data.token, data.user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dermai_token');
    localStorage.removeItem('dermai_user');
    delete api.defaults.headers.common['Authorization'];
  };

  const incrementScans = () => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, totalScans: (prev.totalScans || 0) + 1 };
      localStorage.setItem('dermai_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, incrementScans }}>
      {children}
    </AuthContext.Provider>
  );
}
