import api from './api';

export const bookingService = {
  // ================= CLIENT / USER APIS =================
  // 1. Tạo booking mới (Action: /create)
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings/create', bookingData);
    return response.data;
  },

  // 2. Khách xem danh sách đơn của chính mình (Action: /all)
  getMyBookings: async () => {
    const response = await api.get('/bookings/all');
    return response.data;
  },

  // 3. Xem chi tiết 1 booking theo ID (Action: /detail/:id)
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/detail/${id}`);
    return response.data;
  },

  // 4. Hủy booking và tự động hoàn lại chỗ trống cho tour (Action: /cancel/:id)
  cancelBooking: async (id) => {
    const isAdmin = window.location.pathname.startsWith('/admin');
    if (isAdmin) {
      const response = await api.patch(`/admin/bookings/cancel/${id}`);
      return response.data;
    }
    const response = await api.patch(`/bookings/cancel/${id}`);
    return response.data;
  },

  // 5. Admin xóa hẳn đơn đặt tour (Action: /delete/:id)
  deleteBooking: async (id) => {
    const response = await api.delete(`/admin/bookings/delete/${id}`);
    return response.data;
  },

  // ================= ADMIN APIS =================
  // 6. Admin lấy toàn bộ danh sách booking của tất cả khách hàng (Action: /all)
  getAllBookings: async (params = {}) => {
    const response = await api.get('/admin/bookings/all', { params });
    return response.data;
  },

  // 7. Admin cập nhật trạng thái thanh toán (Action: /payment/:id)
  updatePaymentStatus: async (id, data) => {
    const response = await api.patch(`/admin/bookings/payment/${id}`, data);
    return response.data;
  },
};

export default bookingService;
