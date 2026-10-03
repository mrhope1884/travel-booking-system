import api from './api';

export const contactService = {
  // 1. Khách gửi tin nhắn liên hệ / tư vấn tour (Action: /create)
  createContact: async (contactData) => {
    const response = await api.post('/contacts/create', contactData);
    return response.data;
  },

  // 2. Admin xem danh sách liên hệ (Action: /all)
  getAllContacts: async (params = {}) => {
    const response = await api.get('/admin/contacts/all', { params });
    return response.data?.data || response.data || [];
  },

  // 3. Admin cập nhật trạng thái đã phản hồi (Action: /update/:id)
  updateContactStatus: async (id, status) => {
    const response = await api.patch(`/admin/contacts/update/${id}`, { status });
    return response.data;
  },

  // 4. Admin xóa tin nhắn liên hệ (Action: /delete/:id)
  deleteContact: async (id) => {
    const response = await api.delete(`/admin/contacts/delete/${id}`);
    return response.data;
  },
};

export default contactService;
