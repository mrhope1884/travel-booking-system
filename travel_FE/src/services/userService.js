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

  // ================= ADMIN APIS =================
  // 4. Admin lấy danh sách tất cả người dùng (Action: /all)
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users/all', { params });
    return response.data?.data || response.data || [];
  },

  // 5. Admin xem chi tiết người dùng theo ID (Action: /detail/:id)
  getUserById: async (id) => {
    const response = await api.get(`/admin/users/detail/${id}`);
    return response.data?.data || response.data;
  },

  // 6. Admin thêm người dùng mới (Action: /create)
  createUser: async (userData) => {
    const response = await api.post('/admin/users/create', userData);
    return response.data;
  },

  // 7. Admin sửa thông tin người dùng (Action: /update/:id)
  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/update/${id}`, userData);
    return response.data;
  },

  // 8. Admin xóa người dùng (Action: /delete/:id)
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/delete/${id}`);
    return response.data;
  },
};

export default userService;
