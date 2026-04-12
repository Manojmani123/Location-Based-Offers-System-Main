import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('customerToken');
      if (token) {
        try {
          const res = await api.get('/users/me');
          setUser(res.data.data.user);
        } catch (err) {
          localStorage.removeItem('customerToken');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/users/login', { email, password });
    const { token, data } = res.data;
    localStorage.setItem('customerToken', token);
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const res = await api.post('/users/register', { name, email, password, role: 'customer' });
    const { token, data } = res.data;
    localStorage.setItem('customerToken', token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('customerToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
