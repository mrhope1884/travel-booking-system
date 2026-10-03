import React, { useState, useEffect, useMemo } from 'react';
import { Search, Eye, Ban, X, Trash2 } from 'lucide-react';
import bookingService from '../../services/bookingService';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Pagination from '../../components/admin/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';

// Cấu hình 3 trạng thái thanh toán (khớp enum paymentStatus trong model Booking ở BE)
const PAYMENT_META = {
  pending: { label: 'Chờ thanh toán',      icon: '⏳', bg: '#fff8e1', color: '#f57f17', border: '#ffe082', btn: '#f39c12' },
  paid:    { label: 'Đã thanh toán',       icon: '✓',  bg: '#e8f5e9', color: '#2e7d32', border: '#c8e6c9', btn: '#00a65a' },
  failed:  { label: 'Thanh toán thất bại', icon: '✗',  bg: '#fdecea', color: '#c62828', border: '#f5c6cb', btn: '#dd4b39' },
};

// Badge dùng chung cho bảng và modal
const PaymentBadge = ({ status, large = false }) => {
  const meta = PAYMENT_META[status] || PAYMENT_META.pending;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: large ? '3px 10px' : '3px 8px',
        fontSize: '11px',
        fontWeight: large ? 700 : 600,
        borderRadius: '12px',
        backgroundColor: meta.bg,
        color: meta.color,
        border: `1px solid ${meta.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {meta.icon} {meta.label}
    </span>
  );
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Actions
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await bookingService.getAllBookings();
      setBookings(res.data || []);
    } catch (err) {
      console.error('Lỗi tải danh sách bookings:', err);
      setError(err.response?.data?.message || err.message || 'Không thể tải danh sách đơn đặt tour.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus =
        statusFilter === 'all' ||
        b.status === statusFilter ||
        b.paymentStatus === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchSearch =
        !term ||
        (b.user?.name && b.user.name.toLowerCase().includes(term)) ||
        (b.user?.email && b.user.email.toLowerCase().includes(term)) ||
        (b.tour?.title && b.tour.title.toLowerCase().includes(term)) ||
        (b._id && b._id.toLowerCase().includes(term));
      return matchStatus && matchSearch;
    });
  }, [bookings, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const currentBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage, itemsPerPage]);

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;
    try {
      setActionLoading(true);
      await bookingService.cancelBooking(selectedBooking._id);
      setShowCancelModal(false);
      setToast({ type: 'success', title: 'Thành công', message: 'Đã hủy đơn đặt tour và hoàn lại số chỗ thành công!' });
      fetchBookings();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi hủy đơn!';
      setToast({ type: 'error', title: 'Thất bại', message: msg });
    } finally {
      setActionLoading(false);
    }
  };

  // Hàm cập nhật thanh toán dùng chung cho cả 3 nút
  const handleUpdatePayment = async (status) => {
    if (!selectedBooking) return;
    try {
      setActionLoading(true);
      await bookingService.updatePaymentStatus(selectedBooking._id, { paymentStatus: status });
      setSelectedBooking({ ...selectedBooking, paymentStatus: status });
      setToast({
        type: 'success',
        title: 'Thành công',
        message: `Đã cập nhật trạng thái thanh toán sang "${PAYMENT_META[status].label}"!`,
      });
      fetchBookings();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi cập nhật thanh toán!';
      setToast({ type: 'error', title: 'Thất bại', message: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBooking) return;
    try {
      setActionLoading(true);
      await bookingService.deleteBooking(selectedBooking._id);
      setShowDeleteModal(false);
      setToast({ type: 'success', title: 'Thành công', message: 'Đã xóa đơn đặt tour khỏi hệ thống!' });
      fetchBookings();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi xóa đơn!';
      setToast({ type: 'error', title: 'Thất bại', message: msg });
    } finally {
      setActionLoading(false);
    }
  };

  const formatVND = (num) => new Intl.NumberFormat('vi-VN').format(num || 0);

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
            Quản lý Đơn đặt Tour (Bookings)
          </h2>
          <span style={{ fontSize: '12px', color: '#888' }}>
            Tổng cộng: <strong>{filteredBookings.length}</strong> đơn đặt tour
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Status filter dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '8px 12px',
              border: '1px solid #d2d6de',
              borderRadius: '4px',
              fontSize: '13px',
              outline: 'none',
              backgroundColor: '#fff',
            }}
          >
            <option value="all">Tất cả đơn đặt tour</option>
            <option value="confirmed">Đơn đã xác nhận</option>
            <option value="cancelled">Đơn đã hủy</option>
            <option value="paid">Đã thanh toán (Paid)</option>
            <option value="pending">Chờ thanh toán (Pending)</option>
            <option value="failed">Thanh toán thất bại (Failed)</option>
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
              placeholder="Tìm theo khách, tour..."
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
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
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
          <LoadingSpinner minHeight="300px" text="Đang tải danh sách đơn đặt tour..." />
        ) : error ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#dc3545' }}>
            <p>❌ {error}</p>
            <button
              onClick={fetchBookings}
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
        ) : currentBookings.length === 0 ? (
          <EmptyState message="Chưa có đơn đặt tour nào phù hợp." />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#fafbfc', borderBottom: '1px solid #eee', color: '#666' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, width: '70px' }}>ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, width: '180px' }}>Khách hàng</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Tên tour đã đặt</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, width: '90px' }}>Số ghế</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, width: '120px' }}>Tổng tiền</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, width: '110px' }}>Đặt chỗ</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, width: '150px' }}>Thanh toán</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, width: '170px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((b, idx) => {
                  const idDisplay = b._id ? b._id.slice(-5).toUpperCase() : `B${idx + 1}`;
                  return (
                    <tr
                      key={b._id || idx}
                      style={{
                        borderBottom: '1px solid #f2f4f6',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '12px 16px', color: '#888', fontWeight: 600 }}>{idDisplay}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#333' }}>{b.user?.name || 'Khách hàng'}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>{b.user?.email || 'N/A'}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 500, color: '#444' }}>
                        {b.tour?.title || 'Tour du lịch tham quan'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: '#555', fontWeight: 600 }}>
                        {b.numBookedSeats || 1}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#e53935' }}>
                        {formatVND(b.price)} đ
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <StatusBadge status={b.status} type="booking" />
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <PaymentBadge status={b.paymentStatus} />
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                          <button
                            onClick={() => {
                              setSelectedBooking(b);
                              setShowDetailModal(true);
                            }}
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
                              gap: '3px',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            <Eye size={12} />
                            <span>Xem</span>
                          </button>

                          {b.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                setSelectedBooking(b);
                                setShowCancelModal(true);
                              }}
                              title="Hủy đơn đặt tour"
                              style={{
                                padding: '5px 8px',
                                backgroundColor: '#dd4b39',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                                fontSize: '11px',
                                fontWeight: 600,
                              }}
                            >
                              <Ban size={12} />
                              <span>Hủy</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedBooking(b);
                              setShowDeleteModal(true);
                            }}
                            title="Xóa đơn khỏi hệ thống"
                            style={{
                              padding: '5px 8px',
                              backgroundColor: '#6c757d',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            <Trash2 size={12} />
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
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
          totalItems={filteredBookings.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Booking Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
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
              maxWidth: '560px',
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
                Chi tiết Đơn đặt Tour #{selectedBooking._id?.slice(-6).toUpperCase()}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                <span style={{ color: '#888' }}>Trạng thái đặt chỗ:</span>
                <StatusBadge status={selectedBooking.status} type="booking" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                <span style={{ color: '#888' }}>Trạng thái thanh toán:</span>
                <PaymentBadge status={selectedBooking.paymentStatus} large />
              </div>

              {/* Cập nhật trạng thái thanh toán (PATCH /api/bookings/payment/:id) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ color: '#888' }}>Cập nhật thanh toán:</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.entries(PAYMENT_META).map(([value, m]) => {
                    const isCurrent = selectedBooking.paymentStatus === value;
                    return (
                      <button
                        key={value}
                        disabled={actionLoading || isCurrent}
                        onClick={() => handleUpdatePayment(value)}
                        style={{
                          padding: '4px 10px',
                          backgroundColor: isCurrent ? '#ccc' : m.btn,
                          color: '#fff',
                          border: 'none',
                          borderRadius: '3px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: isCurrent || actionLoading ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                <span style={{ color: '#888' }}>Khách hàng:</span>
                <strong>{selectedBooking.user?.name || 'Khách hàng'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                <span style={{ color: '#888' }}>Email:</span>
                <span>{selectedBooking.user?.email || 'N/A'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                <span style={{ color: '#888' }}>Tour đặt:</span>
                <strong style={{ maxWidth: '300px', textAlign: 'right' }}>
                  {selectedBooking.tour?.title || 'Tour du lịch'}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                <span style={{ color: '#888' }}>Số ghế đặt:</span>
                <span>{selectedBooking.numBookedSeats || 1} ghế</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                <span style={{ color: '#888' }}>Tổng số tiền:</span>
                <strong style={{ color: '#e53935', fontSize: '16px' }}>
                  {formatVND(selectedBooking.price)} VNĐ
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                <span style={{ color: '#888' }}>Ngày đặt:</span>
                <span>{selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleString('vi-VN') : 'N/A'}</span>
              </div>
            </div>

            <div style={{ padding: '12px 20px', backgroundColor: '#f9fafb', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{ padding: '8px 18px', backgroundColor: '#00c0ef', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Confirm Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        title="Hủy đơn đặt tour"
        message={`Bạn có chắc chắn muốn hủy đơn đặt tour này? Hệ thống Backend sẽ tự động hoàn lại ${selectedBooking?.numBookedSeats || 1} chỗ trống cho Tour.`}
        confirmText="Hủy đơn"
        cancelText="Giữ lại"
        onConfirm={handleCancelConfirm}
        onCancel={() => setShowCancelModal(false)}
        isLoading={actionLoading}
        isDanger={true}
      />

      {/* Delete Booking Confirm Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Xóa đơn đặt tour"
        message={`Bạn có chắc chắn muốn xóa hẳn đơn #${selectedBooking?._id?.slice(-5).toUpperCase()} khỏi hệ thống? Thao tác này không thể hoàn tác.`}
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

export default Bookings;