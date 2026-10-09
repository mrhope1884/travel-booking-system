import api from './api';

export const contactService = {
  // 1. Khách gửi tin nhắn liên hệ / tư vấn tour (POST /api/contacts)
  createContact: async (contactData) => {
    const response = await api.post('/contacts', contactData);
    return response.data;
  },

  // ================= ADMIN APIS (RESTful theo đúng BE) =================
  // 2. Admin xem danh sách liên hệ (GET /api/admin/contacts)
  getAllContacts: async (params = {}) => {
    const response = await api.get('/admin/contacts', { params });
    return response.data?.data || response.data || [];
  },

  // 3. Admin cập nhật trạng thái đã phản hồi (PATCH /api/admin/contacts/:id)
  updateContactStatus: async (id, status) => {
    const response = await api.patch(`/admin/contacts/${id}`, { status });
    return response.data;
  },

  // 4. Admin xóa tin nhắn liên hệ (DELETE /api/admin/contacts/:id)
  deleteContact: async (id) => {
    const response = await api.delete(`/admin/contacts/${id}`);
    return response.data;
  },
};

export default contactService;
