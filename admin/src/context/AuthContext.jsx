import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const res = await api.get('/users/me');
          setUser(res.data.data.user);
          localStorage.setItem('adminUser', JSON.stringify(res.data.data.user));
        } catch (error) {
          console.error("Failed to authenticate user", error);
          logout();
        }
      } else {
        // Fallback for immediate UI render if no token
        const storedUser = localStorage.getItem('adminUser');
        if (storedUser) setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/users/login', { email, password });
      const { token, data } = res.data;
      
      const loggedInUser = data.user;
      setUser(loggedInUser);
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(loggedInUser));
      
      return loggedInUser;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      throw new Error(errorMsg);
    }
  };

  const register = async (userData) => {
    try {
      // 1. Create a User with admin role (backend now auto-creates the Business)
      const res = await api.post('/users/register', {
        name: userData.businessName,
        email: userData.email,
        password: userData.password,
        role: 'admin',
        location: {
           type: 'Point',
           coordinates: [0, 0]
        },
        businessName: userData.businessName,
        documents: [userData.documentName || 'placeholder.pdf'],
        category: 'Other'
      });
      
      const { token, data } = res.data;
      const newUser = data.user;
      
      // Store token immediately
      localStorage.setItem('adminToken', token);

      setUser(newUser);
      localStorage.setItem('adminUser', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
       // Cleanup partial registration if it fails
       localStorage.removeItem('adminToken');
       setUser(null);
       const errorMsg = error.response?.data?.message || 'Registration failed';
       throw new Error(errorMsg);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('mockBusinessUser'); // cleanup legacy
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
