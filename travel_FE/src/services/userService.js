import api from './api';

export const userService = {
  // ================= CLIENT / USER APIS =================
  // 1. Khách xem thông tin hồ sơ của chính mình
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data?.data || response.data;
  },

  // 2. Khách cập nhật thông tin cá nhân (tên, SĐT, avatar)
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  // 3. Khách đổi mật khẩu
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // ================= ADMIN APIS (RESTful nguyên bản theo đúng BE) =================
  // --- A. QUẢN LÝ KHÁCH HÀNG (User) -> /api/admin/users ---
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data?.data || response.data || [];
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data?.data || response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // --- B. QUẢN LÝ QUẢN TRỊ VIÊN (Admin) -> /api/admin/admins ---
  getAdmins: async (params = {}) => {
    const response = await api.get('/admin/admins', { params });
    return response.data?.data || response.data || [];
  },

  getAdminById: async (id) => {
    const response = await api.get(`/admin/admins/${id}`);
    return response.data?.data || response.data;
  },

  updateAdmin: async (id, adminData) => {
    const response = await api.put(`/admin/admins/${id}`, adminData);
    return response.data;
  },
};

export default userService;
