import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Loader2, X } from 'lucide-react';
import tourService from '../../services/tourService';
import Pagination from '../../components/admin/Pagination';
import ConfirmModal from '../../components/admin/ConfirmModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Modals & Action states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    maxGroupSize: 20,
    region: 'Miền Bắc',
    imageCover: 'default-tour.jpg',
  });

  const [toast, setToast] = useState(null);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      // Gọi đúng API Quản trị viên: GET /api/admin/tours/all (lấy 100% tour, không ẩn tour hết chỗ)
      const res = await tourService.getAdminTours();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setTours(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách tour:', err);
      setError(err.response?.data?.message || err.message || 'Không thể tải danh sách tour.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // Tìm kiếm tức thì theo tiêu đề, mô tả, khu vực, mã ID
  const filteredTours = useMemo(() => {
    if (!Array.isArray(tours)) return [];
    if (!searchQuery.trim()) return tours;
    const term = searchQuery.toLowerCase();
    return tours.filter(
      (t) =>
        (t.title && t.title.toLowerCase().includes(term)) ||
        (t.description && t.description.toLowerCase().includes(term)) ||
        (t.region && t.region.toLowerCase().includes(term)) ||
        (t._id && t._id.toLowerCase().includes(term))
    );
  }, [tours, searchQuery]);

  // Phân trang
  const totalPages = Math.ceil(filteredTours.length / itemsPerPage) || 1;
  const currentTours = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredTours.slice(start, start + itemsPerPage);
  }, [filteredTours, page, itemsPerPage]);

  // Tự động chuyển về trang 1 khi người dùng gõ tìm kiếm
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      price: '',
      description: '',
      maxGroupSize: 20,
      region: 'Miền Bắc',
      imageCover: 'default-tour.jpg',
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (tour) => {
    setSelectedTour(tour);
    setFormData({
      title: tour.title || '',
      price: tour.price || '',
      description: tour.description || '',
      maxGroupSize: tour.maxGroupSize || 20,
      region: tour.region || 'Miền Bắc',
      imageCover: tour.imageCover || 'default-tour.jpg',
    });
    setShowEditModal(true);
  };

  const handleOpenDelete = (tour) => {
    setSelectedTour(tour);
    setShowDeleteModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await tourService.createTour({
        ...formData,
        price: Number(formData.price),
        maxGroupSize: Number(formData.maxGroupSize),
      });
      setShowAddModal(false);
      setToast({ type: 'success', title: 'Thành công', message: 'Tạo tour du lịch mới thành công!' });
      fetchTours();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Lỗi khi tạo tour!';
      setToast({ type: 'error', title: 'Thất bại', message: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTour) return;
    try {
      setActionLoading(true);
      await tourService.updateTour(selectedTour._id, {
        ...formData,
        price: Number(formData.price),
        maxGroupSize: Number(formData.maxGroupSize),
      });
      setShowEditModal(false);
      setToast({ type: 'success', title: 'Thành công', message: 'Cập nhật thông tin tour thành công!' });
      fetchTours();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi cập nhật tour!';
      setToast({ type: 'error', title: 'Thất bại', message: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTour) return;
    try {
      setActionLoading(true);
      await tourService.deleteTour(selectedTour._id);
      setShowDeleteModal(false);
      setToast({ type: 'success', title: 'Đã xóa', message: 'Đã chuyển tour vào Thùng Rác thành công!' });
      fetchTours();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi xóa tour!';
      setToast({ type: 'error', title: 'Thất bại', message: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const formatVND = (number) => new Intl.NumberFormat('vi-VN').format(number);

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

      {/* Header Toolbar */}
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
            Quản lý Tours du lịch
          </h2>
          <span style={{ fontSize: '12px', color: '#888' }}>
            Tổng số: <strong>{filteredTours.length}</strong> tours đang hoạt động
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search form */}
          <form onSubmit={handleSearch} style={{ position: 'relative', width: '260px' }}>
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
              placeholder="Tìm kiếm tour..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                border: '1px solid #d2d6de',
                borderRadius: '4px',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </form>

          {/* Add Tour button */}
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
            }}
          >
            <Plus size={16} />
            <span>Thêm Tour mới</span>
          </button>
        </div>
      </div>

      {/* Tours Table */}
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
          <LoadingSpinner minHeight="300px" text="Đang tải danh sách tours..." />
        ) : error ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#dc3545' }}>
            <p>❌ {error}</p>
            <button
              onClick={fetchTours}
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
        ) : filteredTours.length === 0 ? (
          <EmptyState
            message="Chưa có tour nào trong hệ thống hoặc không khớp tìm kiếm."
            actionText="Tạo tour mới ngay"
            onAction={handleOpenAdd}
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#fafbfc', borderBottom: '1px solid #eee', color: '#666' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, width: '70px' }}>ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Tên tiêu đề tour</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, width: '130px' }}>Giá vé (VNĐ)</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, width: '110px' }}>Khu vực</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, width: '120px' }}>Số chỗ còn lại</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, width: '150px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentTours.map((tour, idx) => {
                  const idDisplay = tour._id ? tour._id.slice(-5).toUpperCase() : `T${idx + 1}`;
                  const regionVal = tour.region || 'Miền Bắc';
                  const isSoldOut = (tour.maxGroupSize ?? 0) <= 0;
                  return (
                    <tr
                      key={tour._id || idx}
                      style={{
                        borderBottom: '1px solid #f2f4f6',
                        transition: 'background-color 0.15s',
                        backgroundColor: isSoldOut ? '#fffdfa' : 'transparent',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isSoldOut ? '#fff7ed' : '#f9fafb')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isSoldOut ? '#fffdfa' : 'transparent')}
                    >
                      <td style={{ padding: '12px 16px', color: '#888', fontWeight: 600 }}>{idDisplay}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#333' }}>
                        <div>{tour.title}</div>
                        <div style={{ fontSize: '11px', color: '#888', fontWeight: 400, marginTop: '2px' }}>
                          {tour.description ? tour.description.slice(0, 80) + '...' : ''}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#e53935' }}>
                        {formatVND(tour.price)} đ
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: regionVal === 'Miền Nam' ? '#fef3c7' : regionVal === 'Miền Trung' ? '#dcfce7' : '#e0f2fe',
                          color: regionVal === 'Miền Nam' ? '#b45309' : regionVal === 'Miền Trung' ? '#166534' : '#0369a1',
                        }}>
                          {regionVal}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {isSoldOut ? (
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            whiteSpace: 'nowrap',
                          }}>
                            Hết chỗ (0)
                          </span>
                        ) : (
                          <span style={{ color: '#555', fontWeight: 600 }}>
                            {tour.maxGroupSize} chỗ
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <button
                            onClick={() => handleOpenEdit(tour)}
                            title="Sửa tour"
                            style={{
                              padding: '5px 10px',
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
                            <Edit size={13} />
                            <span>Sửa</span>
                          </button>
                          <button
                            onClick={() => handleOpenDelete(tour)}
                            title="Chuyển vào thùng rác"
                            style={{
                              padding: '5px 10px',
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

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          totalItems={filteredTours.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Add Tour Modal */}
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
              maxWidth: '540px',
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
                Thêm Tour du lịch mới
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Tên tiêu đề Tour <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: MIỀN TRUNG 4N3Đ | ĐÀ NẴNG – HỘI AN – BÀ NÀ – HUẾ"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Giá tiền (VNĐ) <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="Ví dụ: 5500000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Số khách tối đa <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="Ví dụ: 20"
                    value={formData.maxGroupSize}
                    onChange={(e) => setFormData({ ...formData, maxGroupSize: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Khu vực / Vùng miền <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d2d6de',
                    borderRadius: '4px',
                    fontSize: '13px',
                    backgroundColor: '#fff',
                  }}
                >
                  <option value="Miền Bắc">Miền Bắc</option>
                  <option value="Miền Trung">Miền Trung</option>
                  <option value="Miền Nam">Miền Nam</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Mô tả lịch trình <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Nhập chi tiết hành trình, điểm tham quan, dịch vụ bao gồm..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d2d6de',
                    borderRadius: '4px',
                    resize: 'vertical',
                  }}
                />
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
                  <span>{actionLoading ? 'Đang tạo...' : 'Tạo Tour'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tour Modal */}
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
              maxWidth: '540px',
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
                Chỉnh sửa thông tin Tour
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
                  Tên tiêu đề Tour <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Giá tiền (VNĐ) <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Số khách tối đa <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.maxGroupSize}
                    onChange={(e) => setFormData({ ...formData, maxGroupSize: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Khu vực / Vùng miền <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d2d6de',
                    borderRadius: '4px',
                    fontSize: '13px',
                    backgroundColor: '#fff',
                  }}
                >
                  <option value="Miền Bắc">Miền Bắc</option>
                  <option value="Miền Trung">Miền Trung</option>
                  <option value="Miền Nam">Miền Nam</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Mô tả lịch trình <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d2d6de',
                    borderRadius: '4px',
                    resize: 'vertical',
                  }}
                />
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

      {/* Confirm Delete Tour Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Chuyển vào Thùng Rác"
        message={`Bạn có chắc chắn muốn chuyển tour "${selectedTour?.title}" vào Thùng Rác? Bạn có thể khôi phục lại bất kỳ lúc nào từ Thùng rác.`}
        confirmText="Xóa tour"
        cancelText="Hủy bỏ"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={actionLoading}
        isDanger={true}
      />
    </div>
  );
};

export default Tours;
