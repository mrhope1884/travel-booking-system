import api from './api';

export const bookingService = {
  // ================= CLIENT / USER APIS (RESTful theo đúng BE) =================
  // 1. Tạo booking mới (POST /api/bookings)
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // 2. Khách xem danh sách đơn của chính mình (GET /api/bookings)
  getMyBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  // 3. Xem chi tiết 1 booking theo ID (GET /api/bookings/:id)
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // 3b. Khách cập nhật phương thức thanh toán cho đơn (PATCH /api/bookings/payment-method/:id)
  updatePaymentMethod: async (id, paymentMethod) => {
    const response = await api.patch(`/bookings/payment-method/${id}`, { paymentMethod });
    return response.data;
  },

  // 4. Hủy booking (Admin: PATCH /api/admin/bookings/cancel/:id | Khách: PATCH /api/bookings/cancel/:id)
  cancelBooking: async (id) => {
    const isAdmin = window.location.pathname.startsWith('/admin');
    if (isAdmin) {
      const response = await api.patch(`/admin/bookings/cancel/${id}`);
      return response.data;
    }
    const response = await api.patch(`/bookings/cancel/${id}`);
    return response.data;
  },

  // ================= ADMIN APIS (RESTful theo đúng BE) =================
  // 5. Admin lấy toàn bộ danh sách booking của tất cả khách hàng (GET /api/admin/bookings)
  getAllBookings: async (params = {}) => {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  },

  // 6. Admin cập nhật trạng thái thanh toán (PATCH /api/admin/bookings/payment/:id)
  updatePaymentStatus: async (id, data) => {
    const response = await api.patch(`/admin/bookings/payment/${id}`, data);
    return response.data;
  },

  // 7. Admin xóa hẳn đơn đặt tour (DELETE /api/admin/bookings/trash/:id)
  deleteBooking: async (id) => {
    const response = await api.delete(`/admin/bookings/trash/${id}`);
    return response.data;
  },
};

export default bookingService;
