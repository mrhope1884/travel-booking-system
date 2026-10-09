import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Compass, 
  RotateCcw,
  Users,
  Eye,
  Trash2,
  FileText
} from 'lucide-react';
import bookingService from '../../services/bookingService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/admin/ConfirmModal';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'confirmed', 'cancelled'

  // Modal hủy đơn
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const navigate = useNavigate();

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      // Gọi API Khách hàng GET /api/bookings/all
      const response = await bookingService.getMyBookings();
      const data = response.data || response || [];
      setBookings(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách đơn:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách đơn đặt tour của bạn.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleOpenCancel = (booking) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    try {
      setCancelLoading(true);
      // Gọi API Backend PATCH /api/bookings/cancel/:id
      await bookingService.cancelBooking(selectedBooking._id || selectedBooking.id);
      setCancelModalOpen(false);
      setSelectedBooking(null);
      // Tải lại danh sách đơn để cập nhật trạng thái mới nhất
      await fetchMyBookings();
    } catch (err) {
      console.error('Lỗi hủy đơn:', err);
      alert(err.response?.data?.message || 'Không thể hủy đơn đặt tour này.');
    } finally {
      setCancelLoading(false);
    }
  };

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter bookings theo tab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    return b.status === activeTab;
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Đơn Đặt Tour Của Tôi
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b' }}>
          Theo dõi trạng thái đặt chỗ, lịch trình khởi hành và quản lý vé du lịch của bạn
        </p>
      </div>

      {/* Tabs Filter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '16px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'ALL', label: 'Tất cả đơn' },
            { id: 'confirmed', label: 'Đã xác nhận' },
            { id: 'cancelled', label: 'Đã hủy' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? 700 : 500,
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#0284c7' : '#f1f5f9',
                color: activeTab === tab.id ? '#ffffff' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label} ({bookings.filter(b => tab.id === 'ALL' ? true : b.status === tab.id).length})
            </button>
          ))}
        </div>

        <button
          onClick={fetchMyBookings}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            fontSize: '13px',
            color: '#334155',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          <RotateCcw size={14} /> Làm mới
        </button>
      </div>

      {/* Loading / Error / Empty States */}
      {loading ? (
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <LoadingSpinner text="Đang tải danh sách đơn đặt tour..." />
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ color: '#dc2626', fontSize: '15px', marginBottom: '16px' }}>{error}</div>
          <button
            onClick={fetchMyBookings}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Thử lại
          </button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title="Bạn chưa có đơn đặt tour nào"
          description="Khám phá ngay các hành trình du lịch danh thắng tuyệt mỹ của Việt Nam và đặt tour nhận ưu đãi!"
          actionText="Khám phá danh sách Tour"
          onAction={() => navigate('/tours')}
        />
      ) : (
        /* Danh sách thẻ Booking */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredBookings.map((b) => {
            const tour = b.tour || {};
            const isCancelled = b.status === 'cancelled';
            const bookingIdStr = String(b._id || b.id || '').toUpperCase();

            return (
              <div
                key={b._id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  padding: '24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  transition: 'box-shadow 0.2s',
                  borderLeft: isCancelled ? '5px solid #ef4444' : '5px solid #10b981'
                }}
              >
                {/* Thông tin Tour & Mã đơn */}
                <div style={{ flex: '1 1 340px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.5px'
                    }}>
                      #{bookingIdStr.slice(-8)}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      Ngày đặt: {formatDate(b.createdAt)}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', lineHeight: 1.3 }}>
                    {tour.title || 'Tour du lịch'}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} color="#0284c7" /> {b.numBookedSeats || 1} khách
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} color="#0284c7" /> 3 Ngày 2 Đêm
                    </span>
                  </div>
                </div>

                {/* Trạng thái & Tổng tiền */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
                  {/* Trạng thái Booking & Payment */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Đặt chỗ:</span>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: isCancelled ? '#fee2e2' : '#dcfce7',
                        color: isCancelled ? '#991b1b' : '#166534'
                      }}>
                        {isCancelled ? '✕ Đã hủy' : '✓ Đã xác nhận'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Thanh toán:</span>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: isCancelled ? '#f1f5f9' : b.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7',
                        color: isCancelled ? '#64748b' : b.paymentStatus === 'paid' ? '#166534' : '#92400e'
                      }}>
                        {isCancelled ? 'Đã hủy đơn' : b.paymentStatus === 'paid' ? '✓ Đã thanh toán' : '⏳ Chờ thanh toán'}
                      </span>
                    </div>
                  </div>

                  {/* Giá tiền */}
                  <div style={{ textAlign: 'right', minWidth: '130px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Tổng thanh toán:</span>
                    <span style={{ fontSize: '19px', fontWeight: 800, color: '#0284c7' }}>
                      {formatVND(b.price)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Nút Xem chi tiết */}
                    <Link
                      to={`/bookings/${b._id}`}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#334155',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Eye size={14} /> Chi tiết
                    </Link>

                    {/* Nút Thanh toán nếu chưa hủy và chưa thanh toán */}
                    {!isCancelled && b.paymentStatus !== 'paid' && (
                      <Link
                        to={`/bookings/payment/${b._id}`}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          backgroundColor: '#0284c7',
                          color: '#ffffff',
                          fontSize: '13px',
                          fontWeight: 600,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <CreditCard size={14} /> Thanh toán
                      </Link>
                    )}

                    {/* Nút Hủy đơn nếu chưa hủy */}
                    {!isCancelled && (
                      <button
                        onClick={() => handleOpenCancel(b)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          border: '1px solid #fecaca',
                          backgroundColor: '#ffffff',
                          color: '#dc2626',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Trash2 size={14} /> Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal xác nhận Hủy đơn */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => { setCancelModalOpen(false); setSelectedBooking(null); }}
        onConfirm={handleConfirmCancel}
        title="Xác nhận hủy đơn đặt tour?"
        message={`Bạn có chắc chắn muốn hủy đơn đặt tour "${selectedBooking?.tour?.title || 'này'}"? Sau khi hủy, ${selectedBooking?.numBookedSeats || 1} chỗ ngồi sẽ được tự động hoàn lại cho tour và không thể khôi phục trạng thái đơn.`}
        confirmText="Xác nhận Hủy Đơn"
        cancelText="Giữ lại đơn"
        danger={true}
        loading={cancelLoading}
      />
    </div>
  );
};

export default MyBookings;
