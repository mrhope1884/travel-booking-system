import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  Trash2, 
  AlertCircle,
  FileText,
  MapPin,
  Compass,
  Phone,
  Mail,
  User
} from 'lucide-react';
import bookingService from '../../services/bookingService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/admin/ConfirmModal';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hủy đơn modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      // Gọi API Backend Node.js GET /api/bookings/:id
      const res = await bookingService.getBookingById(id);
      setBooking(res.data || res);
    } catch (err) {
      console.error('Lỗi khi tải chi tiết booking:', err);
      setError(err.response?.data?.message || 'Không tìm thấy đơn đặt tour này.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const handleConfirmCancel = async () => {
    try {
      setCancelLoading(true);
      await bookingService.cancelBooking(id);
      setCancelModalOpen(false);
      await fetchDetail();
    } catch (err) {
      console.error('Lỗi khi hủy đơn:', err);
      alert(err.response?.data?.message || 'Không thể hủy đơn đặt tour.');
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

  if (loading) {
    return (
      <div style={{ padding: '120px 24px', textAlign: 'center' }}>
        <LoadingSpinner text="Đang tải thông tin chi tiết hóa đơn đặt tour..." />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
          {error || 'Đơn không tồn tại'}
        </h2>
        <Link
          to="/bookings"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={16} /> Quay lại danh sách đơn của tôi
        </Link>
      </div>
    );
  }

  const isCancelled = booking.status === 'cancelled';
  const tour = booking.tour || {};
  const booker = booking.user || {};
  const bookingCode = String(booking._id || booking.id || '').toUpperCase();

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '36px 24px 80px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
        <Link to="/bookings" style={{ color: '#0284c7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={14} /> Danh sách đơn của tôi
        </Link>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Chi tiết đơn #{bookingCode.slice(-8)}</span>
      </div>

      {/* Main Invoice Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
        overflow: 'hidden'
      }}>
        {/* Header Ribbon */}
        <div style={{
          padding: '24px 32px',
          backgroundColor: isCancelled ? '#991b1b' : '#0284c7',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.85, fontWeight: 700 }}>
              Phiếu Đặt Tour Du Lịch
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '2px' }}>
              Mã đơn: #{bookingCode}
            </div>
            <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>
              Ngày tạo đơn: {formatDate(booking.createdAt)}
            </div>
          </div>

          <div style={{
            padding: '8px 18px',
            borderRadius: '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(4px)',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {isCancelled ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
            {isCancelled ? 'ĐÃ HỦY ĐƠN' : 'ĐÃ XÁC NHẬN CHỖ'}
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '32px' }}>
          {/* Section 1: Tour Information */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={18} color="#0284c7" />
              Thông Tin Tour Du Lịch
            </h3>

            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '20px'
            }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
                {tour.title || 'Tour du lịch'}
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginBottom: '16px' }}>
                {tour.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Thời gian lịch trình:</span>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>3 Ngày 2 Đêm</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Số lượng khách:</span>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{booking.numBookedSeats || 1} người</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Đơn giá niêm yết:</span>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{formatVND(tour.price)} / người</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Booker Information */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#0284c7" />
              Thông Tin Khách Hàng Đặt Tour
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              fontSize: '13px'
            }}>
              <div>
                <span style={{ color: '#64748b' }}>Họ và tên người đặt:</span>
                <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{booker.name || 'Khách hàng'}</div>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Địa chỉ Email:</span>
                <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{booker.email || '—'}</div>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Loại tài khoản:</span>
                <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                  {booker.role === 'admin' ? 'Quản trị viên' : 'Khách hàng thành viên'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Cost Breakdown */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#0284c7" />
              Bảng Kê Chi Phí & Trạng Thái
            </h3>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>Đơn giá vé:</td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600 }}>{formatVND(tour.price)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>Số lượng vé đặt:</td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600 }}>x {booking.numBookedSeats || 1} khách</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>Trạng thái thanh toán:</td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: isCancelled ? '#f1f5f9' : booking.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7',
                        color: isCancelled ? '#64748b' : booking.paymentStatus === 'paid' ? '#166534' : '#92400e'
                      }}>
                        {isCancelled ? 'Đã hủy đơn' : booking.paymentStatus === 'paid' ? '✓ Đã thanh toán' : '⏳ Chờ thanh toán'}
                      </span>
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#f0f9ff' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#0c4a6e', fontSize: '15px' }}>Tổng số tiền thanh toán:</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 800, color: '#0284c7', fontSize: '20px' }}>
                      {formatVND(booking.price)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
            <Link
              to="/bookings"
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={14} /> Quay lại danh sách
            </Link>

            <div style={{ display: 'flex', gap: '12px' }}>
              {!isCancelled && (
                <>
                  <button
                    onClick={() => setCancelModalOpen(true)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      border: '1px solid #fecaca',
                      backgroundColor: '#ffffff',
                      color: '#dc2626',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Trash2 size={14} /> Hủy đơn đặt tour
                  </button>

                  <Link
                    to={`/payment/${booking._id}`}
                    style={{
                      padding: '10px 22px',
                      borderRadius: '8px',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
                    }}
                  >
                    <CreditCard size={14} /> Thanh toán ngay
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal xác nhận hủy */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Xác nhận hủy đơn đặt tour?"
        message={`Bạn có chắc chắn muốn hủy đơn đặt tour "${tour.title || 'này'}"? Số lượng ${booking.numBookedSeats || 1} chỗ ngồi sẽ tự động được hoàn lại cho tour trong hệ thống.`}
        confirmText="Xác nhận Hủy Đơn"
        cancelText="Giữ lại đơn"
        danger={true}
        loading={cancelLoading}
      />
    </div>
  );
};

export default BookingDetail;
