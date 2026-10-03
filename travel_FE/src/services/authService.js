import api from './api';

export const authService = {
  // ================= ADMIN AUTHENTICATION =================
  adminLogin: async (email, password) => {
    try {
      const response = await api.post('/admin/auth/login', { email, password });
      if (response.data?.token) {
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_user', JSON.stringify(response.data.user));

        // Đồng thời lưu phiên user để Admin xem được trang khách hàng
        localStorage.setItem('user_token', response.data.token);
        localStorage.setItem('user_info', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  adminLogout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  getAdminToken: () => localStorage.getItem('admin_token'),

  getAdminUser: () => {
    try {
      const user = localStorage.getItem('admin_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAdminAuthenticated: () => {
    const token = localStorage.getItem('admin_token');
    const user = authService.getAdminUser();
    return !!token && user?.role === 'admin';
  },

  // ================= USER AUTHENTICATION =================
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.token) {
        const user = response.data.user;

        localStorage.setItem('user_token', response.data.token);
        localStorage.setItem('user_info', JSON.stringify(user));

        // Nếu tài khoản là Admin: Tự động cấp luôn quyền Quản trị
        if (user && user.role === 'admin') {
          localStorage.setItem('admin_token', response.data.token);
          localStorage.setItem('admin_user', JSON.stringify(user));
        } else {
          // Khách hàng thông thường: Xóa bỏ phiên quản trị cũ
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
        }
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_info');
  },

  getUserToken: () => localStorage.getItem('user_token') || localStorage.getItem('admin_token'),

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user_info') || localStorage.getItem('admin_user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },

  isUserAuthenticated: () => {
    return !!(localStorage.getItem('user_token') || localStorage.getItem('admin_token'));
  },

  // ================= TIỆN ÍCH XÁC THỰC HỆ THỐNG =================
  getToken: () => {
    if (window.location.pathname.startsWith('/admin')) {
      return localStorage.getItem('admin_token');
    }
    return localStorage.getItem('user_token') || localStorage.getItem('admin_token');
  },

  isAuthenticated: () => {
    if (window.location.pathname.startsWith('/admin')) {
      return authService.isAdminAuthenticated();
    }
    return authService.isUserAuthenticated();
  },

  isAdmin: () => {
    const admin = authService.getAdminUser();
    return admin?.role === 'admin';
  }
};

export default authService;
