import api from './api';

export const tourService = {
  // ================= CLIENT / USER APIS =================
  // 1. Lấy danh sách tour nổi bật cho Trang chủ (Action: /featured)
  getFeaturedTours: async () => {
    const response = await api.get('/tours/featured');
    return response.data?.data || response.data || [];
  },

  // 2. Lấy danh sách tours (Action: /all)
  getAllTours: async (params = {}) => {
    const response = await api.get('/tours/all', { params });
    return response.data;
  },

  // 3. Lấy chi tiết 1 tour theo ID (Action: /detail/:id)
  getTourById: async (id) => {
    const response = await api.get(`/tours/detail/${id}`);
    return response.data?.data || response.data;
  },

  // ================= ADMIN APIS =================
  // 4. Lấy danh sách tour cho Admin quản lý (Action: /all)
  getAdminTours: async (params = {}) => {
    const response = await api.get('/admin/tours/all', { params });
    return response.data;
  },

  // 5. Tạo tour mới (Action: /create)
  createTour: async (tourData) => {
    const response = await api.post('/admin/tours/create', tourData);
    return response.data;
  },

  // 6. Cập nhật thông tin tour (Action: /update/:id)
  updateTour: async (id, tourData) => {
    const response = await api.put(`/admin/tours/update/${id}`, tourData);
    return response.data;
  },

  // 7. Chuyển tour vào thùng rác / xóa mềm (Action: /delete/:id)
  deleteTour: async (id) => {
    const response = await api.delete(`/admin/tours/delete/${id}`);
    return response.data;
  },

  // 8. Lấy danh sách tour trong thùng rác (Action: /trash)
  getTrashTours: async () => {
    const response = await api.get('/admin/tours/trash');
    return response.data;
  },

  // 9. Khôi phục tour từ thùng rác (Action: /restore/:id)
  restoreTour: async (id) => {
    const response = await api.patch(`/admin/tours/restore/${id}`);
    return response.data;
  },

  // 10. Xóa vĩnh viễn tour khỏi cơ sở dữ liệu (Action: /destroy/:id)
  destroyTour: async (id) => {
    const response = await api.delete(`/admin/tours/destroy/${id}`);
    return response.data;
  },
};

export default tourService;
