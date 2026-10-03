import axios from 'axios';

// Hàm kiểm tra thời hạn token JWT phía client
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Tự động gán đúng loại token (Admin hoặc User) theo cổng truy cập
api.interceptors.request.use(
  (config) => {
    const isAdminRoute = window.location.pathname.startsWith('/admin') || config.url?.startsWith('/admin');
    const token = isAdminRoute
      ? localStorage.getItem('admin_token')
      : (localStorage.getItem('user_token') || localStorage.getItem('admin_token'));

    if (token) {
      if (isTokenExpired(token)) {
        console.warn('⚠️ Token đã quá hạn (exp). Tự động dọn dẹp và yêu cầu đăng nhập lại.');
        if (isAdminRoute) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          if (!window.location.pathname.includes('/admin/login')) {
            window.location.href = '/admin/login?expired=1';
          }
        } else {
          localStorage.removeItem('user_token');
          localStorage.removeItem('user_info');
          if (!window.location.pathname.includes('/login')) {
            const current = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `/login?redirect=${current}&expired=1`;
          }
        }
        return Promise.reject(new Error('Phiên đăng nhập đã hết hạn!'));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Bắt lỗi 401 và điều hướng về đúng cổng đăng nhập
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      console.warn(`⚠️ Phiên đăng nhập hết hạn (401) tại phân hệ ${isAdminRoute ? 'Admin' : 'User'}.`);

      if (isAdminRoute) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login?expired=1';
        }
      } else {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_info');
        if (!window.location.pathname.includes('/login')) {
          const current = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = `/login?redirect=${current}&expired=1`;
        }
      }
    } else if (status === 403) {
      console.error('⛔ Quyền truy cập bị từ chối (403): Bạn không đủ thẩm quyền thực hiện thao tác này.');
    }

    return Promise.reject(error);
  }
);

export default api;
