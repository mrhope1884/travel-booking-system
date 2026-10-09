import api from './api';

export const tourService = {
  // ================= CLIENT / USER APIS (RESTful theo đúng BE) =================
  // 1. Lấy danh sách tour nổi bật cho Trang chủ (GET /api/tours/featured)
  getFeaturedTours: async () => {
    const response = await api.get('/tours/featured');
    return response.data?.data || response.data || [];
  },

  // 2. Lấy danh sách tours (GET /api/tours)
  getAllTours: async (params = {}) => {
    const response = await api.get('/tours', { params });
    return response.data;
  },

  // 3. Lấy chi tiết 1 tour theo ID (GET /api/tours/:id)
  getTourById: async (id) => {
    const response = await api.get(`/tours/${id}`);
    return response.data?.data || response.data;
  },

  // ================= ADMIN APIS (RESTful theo đúng BE) =================
  // 4. Lấy danh sách tour cho Admin quản lý (GET /api/admin/tours)
  getAdminTours: async (params = {}) => {
    const response = await api.get('/admin/tours', { params });
    return response.data;
  },

  // 5. Tạo tour mới (POST /api/admin/tours)
  createTour: async (tourData) => {
    const response = await api.post('/admin/tours', tourData);
    return response.data;
  },

  // 6. Cập nhật thông tin tour (PUT /api/admin/tours/:id)
  updateTour: async (id, tourData) => {
    const response = await api.put(`/admin/tours/${id}`, tourData);
    return response.data;
  },

  // 7. Chuyển tour vào thùng rác / xóa mềm (DELETE /api/admin/tours/:id)
  deleteTour: async (id) => {
    const response = await api.delete(`/admin/tours/${id}`);
    return response.data;
  },

  // 8. Lấy danh sách tour trong thùng rác (GET /api/admin/tours/trash)
  getTrashTours: async () => {
    const response = await api.get('/admin/tours/trash');
    return response.data;
  },

  // 9. Khôi phục tour từ thùng rác (PATCH /api/admin/tours/trash/:id)
  restoreTour: async (id) => {
    const response = await api.patch(`/admin/tours/trash/${id}`);
    return response.data;
  },

  // 10. Xóa vĩnh viễn tour khỏi cơ sở dữ liệu (DELETE /api/admin/tours/trash/:id)
  destroyTour: async (id) => {
    const response = await api.delete(`/admin/tours/trash/${id}`);
    return response.data;
  },
};

export default tourService;
