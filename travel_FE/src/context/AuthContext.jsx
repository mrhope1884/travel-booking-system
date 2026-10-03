import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Trạng thái độc lập cho Người dùng (Khách hàng)
  const [user, setUser] = useState(authService.getCurrentUser());
  const [userToken, setUserToken] = useState(authService.getUserToken());

  // Trạng thái độc lập cho Quản trị viên (Admin)
  const [admin, setAdmin] = useState(authService.getAdminUser());
  const [adminToken, setAdminToken] = useState(authService.getAdminToken());

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(authService.getCurrentUser());
    setUserToken(authService.getUserToken());
    setAdmin(authService.getAdminUser());
    setAdminToken(authService.getAdminToken());
    setLoading(false);
  }, []);

  // Xử lý đăng nhập Admin
  const adminLogin = async (email, password) => {
    const result = await authService.adminLogin(email, password);
    setAdmin(result.user);
    setAdminToken(result.token);
    setUser(result.user);
    setUserToken(result.token);
    return result;
  };

  // Xử lý đăng xuất Admin
  const adminLogout = () => {
    authService.adminLogout();
    setAdmin(null);
    setAdminToken(null);
  };

  // Xử lý đăng nhập User
  const login = async (email, password) => {
    const result = await authService.login(email, password);
    setUser(result.user);
    setUserToken(result.token);

    // Nếu tài khoản là Admin: Cập nhật luôn State Admin trong Context
    if (result.user && result.user.role === 'admin') {
      setAdmin(result.user);
      setAdminToken(result.token);
    } else {
      setAdmin(null);
      setAdminToken(null);
    }

    return result;
  };

  // Xử lý đăng xuất User
  const logout = () => {
    authService.logout();
    setUser(null);
    setUserToken(null);
  };

  const isUserAuthenticated = !!userToken;
  const isAdminAuthenticated = !!adminToken && admin?.role === 'admin';

  const value = {
    // Phân hệ User
    user,
    userToken,
    login,
    logout,
    isUserAuthenticated,

    // Phân hệ Admin
    admin,
    adminToken,
    adminLogin,
    adminLogout,
    isAdminAuthenticated,

    // Tiện ích cung cấp token và auth chung
    token: window.location.pathname.startsWith('/admin') ? adminToken : userToken,
    isAuthenticated: window.location.pathname.startsWith('/admin') ? isAdminAuthenticated : isUserAuthenticated,
    isAdmin: admin?.role === 'admin',
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
