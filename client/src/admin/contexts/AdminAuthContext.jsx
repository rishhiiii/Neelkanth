import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as adminApi from '../api/adminApi';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore admin from localStorage if token exists
  useEffect(() => {
    const token = localStorage.getItem('adminAccessToken');
    if (token) {
      const stored = localStorage.getItem('adminUser');
      if (stored) {
        try {
          setAdmin(JSON.parse(stored));
        } catch {
          // Corrupted data — clear everything
          localStorage.removeItem('adminAccessToken');
          localStorage.removeItem('adminRefreshToken');
          localStorage.removeItem('adminUser');
        }
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await adminApi.login(email, password);
    const { accessToken, refreshToken, admin: adminData } = data.data;

    localStorage.setItem('adminAccessToken', accessToken);
    localStorage.setItem('adminRefreshToken', refreshToken);
    localStorage.setItem('adminUser', JSON.stringify(adminData));
    setAdmin(adminData);

    return adminData;
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('adminRefreshToken');
      if (refreshToken) {
        await adminApi.logout(refreshToken);
      }
    } catch {
      // Logout API failure is non-critical — clear local state regardless
    } finally {
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminRefreshToken');
      localStorage.removeItem('adminUser');
      setAdmin(null);
    }
  }, []);

  const isAuthenticated = !!admin;
  const role = admin?.role ?? null;

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated, role }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

export default AdminAuthContext;
