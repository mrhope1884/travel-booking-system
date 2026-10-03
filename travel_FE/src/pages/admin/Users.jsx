import React, { useState, useEffect, useMemo } from 'react';
import { Search, UserPlus, Eye, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import userService from '../../services/userService';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Pagination from '../../components/admin/Pagination';
import UserDetail from './UserDetail';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Pagination & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('user');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    status: 'active',
  });

  // Toast state
  const [toast, setToast] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = roleFilter !== 'all' ? { role: roleFilter } : {};
      const data = await userService.getUsers(params);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải danh sách người dùng:', err);
      setError(err.message || 'Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  // Filtered & Paginated users
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term)) ||
        (u.role && u.role.toLowerCase().includes(term)) ||
        (u._id && u._id.toLowerCase().includes(term))
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const currentUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Handlers
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
      status: 'active',
    });
    setShowAddModal(true);
  };

  const handleOpenView = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      status: user.status || 'active',
      phone: user.phone || '',
    });
    setShowEditModal(true);
  };

  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await userService.createUser(formData);
      setShowAddModal(false);
      setToast({ type: 'success', title: 'Thành công', message: 'Đã thêm người dùng mới thành công!' });
      await fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Lỗi khi tạo người dùng!';
      setToast({ type: 'error', title: 'Thất bại', message: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      setActionLoading(true);
      await userService.updateUser(selectedUser._id || selectedUser.id, formData);
      setShowEditModal(false);
      setToast({ type: 'success', title: 'Thành công', message: 'Cập nhật thông tin người dùng thành công!' });
      await fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi cập nhật!';
      setToast({ type: 'error', title: 'Thất bại', message: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      setActionLoading(true);
      await userService.deleteUser(selectedUser._id || selectedUser.id);
      setShowDeleteModal(false);
      setToast({ type: 'success', title: 'Đã xóa', message: 'Đã xóa người dùng khỏi hệ thống thành công!' });
      await fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi xóa!';
      setToast({ type: 'error', title: 'Thất bại', message: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* 1. Header Toolbar */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e9ec',
          borderRadius: '4px',
          padding: '16px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#333', margin: 0 }}>
            Quản lý người dùng
          </h2>
          <span style={{ fontSize: '12px', color: '#888' }}>
            Tổng cộng: <strong>{filteredUsers.length}</strong> {roleFilter === 'user' ? 'khách hàng' : 'tài khoản'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Role Filter dropdown */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '8px 12px',
              border: '1px solid #d2d6de',
              borderRadius: '4px',
              fontSize: '13px',
              outline: 'none',
              backgroundColor: '#fff',
              cursor: 'pointer',
              color: '#333',
              fontWeight: 500,
            }}
          >
            <option value="user">Chỉ Khách hàng (User)</option>
            <option value="all">Tất cả tài khoản (User & Admin)</option>
          </select>

          {/* Search box */}
          <div style={{ position: 'relative', width: '240px' }}>
            <span
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#999',
                display: 'flex',
              }}
            >
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                border: '1px solid #d2d6de',
                borderRadius: '4px',
                fontSize: '13px',
                outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#00c0ef')}
              onBlur={(e) => (e.target.style.borderColor = '#d2d6de')}
            />
          </div>

          {/* Add User button */}
          <button
            onClick={handleOpenAdd}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#00a65a',
              color: '#ffffff',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#008d4c')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#00a65a')}
          >
            <UserPlus size={16} />
            <span>Thêm người dùng</span>
          </button>
        </div>
      </div>

      {/* 2. Main Users Table */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e9ec',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <LoadingSpinner minHeight="300px" text="Đang tải danh sách người dùng..." />
        ) : error ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#dc3545' }}>
            <p>❌ {error}</p>
            <button
              onClick={fetchUsers}
              style={{
                marginTop: '10px',
                padding: '6px 14px',
                background: '#00c0ef',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Thử lại
            </button>
          </div>
        ) : currentUsers.length === 0 ? (
          <EmptyState
            message="Không tìm thấy người dùng nào phù hợp."
            actionText="Làm mới tìm kiếm"
            onAction={() => setSearchTerm('')}
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#fafbfc', borderBottom: '1px solid #eee', color: '#666' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, width: '70px' }}>ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, width: '70px' }}>Avatar</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Họ và tên</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Số điện thoại</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, width: '100px' }}>Role</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, width: '100px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, width: '120px' }}>Ngày tạo</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, width: '160px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, idx) => {
                  const idDisplay = user._id ? (user._id.length > 8 ? user._id.slice(-6) : user._id) : `U${idx + 1}`;
                  return (
                    <tr
                      key={user._id || user.id || idx}
                      style={{
                        borderBottom: '1px solid #f2f4f6',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* ID */}
                      <td style={{ padding: '12px 16px', color: '#888', fontWeight: 600 }}>
                        {idDisplay}
                      </td>

                      {/* Avatar */}
                      <td style={{ padding: '12px 16px' }}>
                        <img
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                          alt={user.name}
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            border: '1px solid #eee',
                            objectFit: 'cover',
                          }}
                        />
                      </td>

                      {/* Name */}
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#333' }}>
                        {user.name || 'Chưa cập nhật'}
                      </td>

                      {/* Email */}
                      <td style={{ padding: '12px 16px', color: '#555' }}>
                        {user.email}
                      </td>
                      {/* Phone */}
                      <td style={{ padding: '12px 16px', color: '#555' }}>
                        {user.phone || 'Chưa cập nhật'}
                      </td>
                      {/* Role */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <StatusBadge status={user.role || 'user'} type="role" />
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <StatusBadge status={user.status || 'active'} type="userStatus" />
                      </td>

                      {/* Created At */}
                      <td style={{ padding: '12px 16px', color: '#777' }}>
                        {formatDate(user.createdAt || user.timestamps?.createdAt)}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <button
                            onClick={() => handleOpenView(user)}
                            title="Xem chi tiết"
                            style={{
                              padding: '5px 8px',
                              backgroundColor: '#00c0ef',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            <Eye size={13} />
                            <span>Xem</span>
                          </button>

                          <button
                            onClick={() => handleOpenEdit(user)}
                            title="Chỉnh sửa người dùng"
                            style={{
                              padding: '5px 8px',
                              backgroundColor: '#f39c12',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            <Edit2 size={13} />
                            <span>Sửa</span>
                          </button>

                          <button
                            onClick={() => handleOpenDelete(user)}
                            title="Xóa người dùng"
                            style={{
                              padding: '5px 8px',
                              backgroundColor: '#dd4b39',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            <Trash2 size={13} />
                            <span>Xóa</span>
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

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* 3. MODAL: View User Detail */}
      <UserDetail
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        user={selectedUser}
      />

      {/* 4. MODAL: Add User (Connects to POST /api/auth/register) */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '6px',
              width: '90%',
              maxWidth: '480px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#333', margin: 0 }}>
                Thêm Người dùng mới
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Họ và tên <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Email <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="nguyenvana@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Số điện thoại
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 0912345678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                />
              </div>
              
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Mật khẩu <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Ít nhất 6 ký tự"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Vai trò (Role)
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                  >
                    <option value="user">User (Khách hàng)</option>
                    <option value="staff">Staff (Nhân viên)</option>
                    <option value="admin">Admin (Quản trị)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Trạng thái (Status)
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                  >
                    <option value="active">Active (Hoạt động)</option>
                    <option value="inactive">Inactive (Tạm khóa)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '8px 16px',
                    background: '#fff',
                    border: '1px solid #d2d6de',
                    borderRadius: '4px',
                    color: '#555',
                    cursor: 'pointer',
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    padding: '8px 20px',
                    background: '#00a65a',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {actionLoading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                  <span>{actionLoading ? 'Đang tạo...' : 'Tạo người dùng'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: Edit User */}
      {showEditModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '6px',
              width: '90%',
              maxWidth: '480px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#333', margin: 0 }}>
                Chỉnh sửa Người dùng
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Họ và tên <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #eee',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    color: '#777',
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Số điện thoại
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 0912345678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Vai trò (Role)
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                  >
                    <option value="user">User (Khách hàng)</option>
                    <option value="staff">Staff (Nhân viên)</option>
                    <option value="admin">Admin (Quản trị)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Trạng thái (Status)
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                  >
                    <option value="active">Active (Hoạt động)</option>
                    <option value="inactive">Inactive (Tạm khóa)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '8px 16px',
                    background: '#fff',
                    border: '1px solid #d2d6de',
                    borderRadius: '4px',
                    color: '#555',
                    cursor: 'pointer',
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    padding: '8px 20px',
                    background: '#f39c12',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {actionLoading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                  <span>{actionLoading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: Confirm Delete User */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa người dùng "${selectedUser?.name || selectedUser?.email}" khỏi hệ thống? Thao tác này không thể hoàn tác.`}
        confirmText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={actionLoading}
        isDanger={true}
      />
    </div>
  );
};

export default Users;
