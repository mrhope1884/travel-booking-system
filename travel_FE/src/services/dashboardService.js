import api from './api';

export const dashboardService = {
  // Lấy toàn bộ số liệu thống kê Dashboard Quản trị (GET /api/admin/dashboard)
  getDashboardData: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data?.data || response.data;
    } catch (e) {
      // Dự phòng nếu gọi qua route cũ
      const response = await api.get('/dashboard');
      return response.data?.data || response.data;
    }
  },
};

export default dashboardService;
