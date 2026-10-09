import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Eye,
  Edit2,
  X,
  Phone,
  Mail,
  User,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';

const Admins = () => {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    status: 'active',
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      // Kết nối trực tiếp vào API Backend RESTful: GET /api/admin/admins
      const data = await userService.getAdmins();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách Admin:', err);
      setError(err.response?.data?.message || err.message || 'Không thể tải danh sách Quản trị viên.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // 1. Mở Modal Xem chi tiết (kết nối GET /api/admin/admins/:id)
  const handleOpenDetail = async (id) => {
    try {
      setDetailLoading(true);
      setShowDetailModal(true);
      const data = await userService.getAdminById(id);
      setSelectedAdmin(data);
    } catch (err) {
      console.error('Lỗi tải chi tiết Admin:', err);
      setToast({
        type: 'error',
        title: 'Thất bại',
        message: err.response?.data?.message || err.message || 'Không thể tải chi tiết Admin!',
      });
      setShowDetailModal(false);
    } finally {
      setDetailLoading(false);
    }
  };

  // 2. Mở Modal Chỉnh sửa
  const handleOpenEdit = (admin) => {
    setSelectedAdmin(admin);
    setEditFormData({
      name: admin.name || '',
      phone: admin.phone || '',
      status: admin.status || 'active',
    });
    setShowEditModal(true);
  };

  // 3. Xử lý Lưu cập nhật (kết nối PUT /api/admin/admins/:id)
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    if (!editFormData.name.trim()) {
      setToast({
        type: 'warning',
        title: 'Cảnh báo',
        message: 'Vui lòng nhập họ và tên của Quản trị viên!',
      });
      return;
    }

    try {
      setActionLoading(true);
      const res = await userService.updateAdmin(selectedAdmin._id, {
        name: editFormData.name.trim(),
        phone: editFormData.phone.trim(),
        status: editFormData.status,
        role: 'admin',
      });

      const updated = res.data || res;

      // Cập nhật ngay trên bảng hiển thị mà không cần tải lại toàn bộ trang
      setAdmins((prev) =>
        prev.map((a) => (a._id === selectedAdmin._id ? { ...a, ...updated } : a))
      );

      setToast({
        type: 'success',
        title: 'Thành công',
        message: '🎉 Cập nhật thông tin Quản trị viên thành công!',
      });
      setShowEditModal(false);
    } catch (err) {
      console.error('Lỗi khi cập nhật Admin:', err);
      setToast({
        type: 'error',
        title: 'Thất bại',
        message: err.response?.data?.message || err.message || 'Lỗi khi cập nhật Admin!',
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e9ec',
          borderRadius: '4px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#e0f7fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00c0ef',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#333' }}>
                Quản lý Quản trị viên (Admin)
              </h2>
              <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0 0' }}>
                Danh sách tài khoản có đặc quyền quản trị cao nhất trên hệ thống ({admins.length} tài khoản)
              </p>
            </div>
          </div>

          <button
            onClick={fetchAdmins}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #d2d6de',
              backgroundColor: '#fff',
              fontSize: '12px',
              color: '#444',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <RefreshCw size={13} />
            <span>Làm mới</span>
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <LoadingSpinner text="Đang tải danh sách Admin từ Backend..." />
          </div>
        ) : error ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#dc3545' }}>
            <p>❌ {error}</p>
            <button
              onClick={fetchAdmins}
              style={{
                marginTop: '10px',
                padding: '6px 14px',
                backgroundColor: '#00c0ef',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#fafbfc', borderBottom: '1px solid #eee', color: '#666' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Tên Admin</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Số điện thoại</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>Cấp quyền</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>Trạng thái</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => {
                  const isCurrent = admin._id === (currentUser?.id || currentUser?._id) || admin.email === currentUser?.email;
                  return (
                    <tr key={admin._id} style={{ borderBottom: '1px solid #f2f4f6' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#333' }}>
                        {admin.name || 'Admin'} {isCurrent && <span style={{ color: '#00c0ef', fontSize: '11px', fontWeight: 700 }}>(Bạn)</span>}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#555' }}>
                        {admin.email}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#666' }}>
                        {admin.phone || <span style={{ color: '#aaa', fontStyle: 'italic' }}>Chưa cập nhật</span>}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{ background: '#00c0ef', color: '#fff', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700 }}>
                          SUPER ADMIN
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{ background: admin.status === 'inactive' ? '#999' : '#00a65a', color: '#fff', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 600 }}>
                          {admin.status === 'inactive' ? 'Tạm khóa' : 'Đang hoạt động'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenDetail(admin._id)}
                            title="Xem chi tiết Admin"
                            style={{
                              padding: '5px 10px',
                              borderRadius: '4px',
                              border: '1px solid #0284c7',
                              backgroundColor: '#f0f9ff',
                              color: '#0284c7',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px',
                              fontWeight: 600,
                              transition: 'all 0.2s',
                            }}
                          >
                            <Eye size={13} /> Chi tiết
                          </button>
                          <button
                            onClick={() => handleOpenEdit(admin)}
                            title="Chỉnh sửa thông tin"
                            style={{
                              padding: '5px 10px',
                              borderRadius: '4px',
                              border: '1px solid #d97706',
                              backgroundColor: '#fffbeb',
                              color: '#d97706',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px',
                              fontWeight: 600,
                              transition: 'all 0.2s',
                            }}
                          >
                            <Edit2 size={13} /> Sửa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL 1: XEM CHI TIẾT ADMIN ================= */}
      {showDetailModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
          onClick={() => setShowDetailModal(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                  Hồ Sơ Chi Tiết Quản Trị Viên
                </h3>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {detailLoading || !selectedAdmin ? (
                <div style={{ padding: '30px 0', textAlign: 'center' }}>
                  <LoadingSpinner text="Đang tải dữ liệu chi tiết..." />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
                  {/* Avatar & Main Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        backgroundColor: '#0284c7',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                        fontWeight: 700,
                      }}
                    >
                      {selectedAdmin.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                        {selectedAdmin.name || 'Admin'}
                      </h4>
                      <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
                        {selectedAdmin.email}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} /> Mã tài khoản:
                    </span>
                    <strong style={{ fontFamily: 'monospace', color: '#334155' }}>{selectedAdmin._id}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} /> Số điện thoại:
                    </span>
                    <strong>{selectedAdmin.phone || 'Chưa cập nhật'}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={14} /> Cấp bậc:
                    </span>
                    <span style={{ background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                      SUPER ADMIN
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={14} /> Trạng thái:
                    </span>
                    <span style={{ background: selectedAdmin.status === 'inactive' ? '#64748b' : '#16a34a', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                      {selectedAdmin.status === 'inactive' ? 'Tạm khóa' : 'Đang hoạt động'}
                    </span>
                  </div>

                  {selectedAdmin.createdAt && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} /> Ngày tham gia:
                      </span>
                      <span style={{ color: '#475569' }}>{new Date(selectedAdmin.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '12px 20px', backgroundColor: '#f8fafc', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleOpenEdit(selectedAdmin);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: '#d97706',
                  color: '#fff',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Edit2 size={14} /> Chỉnh sửa
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: '#e2e8f0',
                  color: '#334155',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: CHỈNH SỬA ADMIN ================= */}
      {showEditModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
          onClick={() => !actionLoading && setShowEditModal(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit2 size={18} color="#d97706" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                  Cập Nhật Thông Tin Quản Trị Viên
                </h3>
              </div>
              <button
                disabled={actionLoading}
                onClick={() => setShowEditModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit}>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                {/* Email (Readonly) */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                    Email đăng nhập (Cố định):
                  </label>
                  <input
                    type="email"
                    value={selectedAdmin?.email || ''}
                    disabled
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Họ và tên */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                    Họ và tên: <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    placeholder="Nhập họ và tên..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                    Số điện thoại:
                  </label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    placeholder="Nhập số điện thoại liên hệ..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Trạng thái hoạt động */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                    Trạng thái hoạt động:
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      backgroundColor: '#fff',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="active">Đang hoạt động (Active)</option>
                    <option value="inactive">Tạm khóa (Inactive)</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div style={{ padding: '14px 20px', backgroundColor: '#f8fafc', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    backgroundColor: '#e2e8f0',
                    color: '#334155',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '6px',
                    backgroundColor: '#0284c7',
                    color: '#fff',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {actionLoading ? (
                    <>
                      <Loader2 size={14} className="spin" /> Đang lưu...
                    </>
                  ) : (
                    'Lưu thay đổi'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;
