import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cashtrack_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.get('/api/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('cashtrack_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('cashtrack_token', res.data.token);
    setUser(res.data.user);
    toast.success('Welcome back to CashTrack');
  };

  const register = async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password });
    localStorage.setItem('cashtrack_token', res.data.token);
    setUser(res.data.user);
    toast.success('Account created successfully');
  };

  const updateProfile = async (payload) => {
    const res = await api.put('/api/auth/profile', payload);
    setUser(res.data.user);
    toast.success('Profile updated');
  };

  const logout = () => {
    localStorage.removeItem('cashtrack_token');
    setUser(null);
    toast('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
