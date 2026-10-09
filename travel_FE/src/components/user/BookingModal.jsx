import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  CreditCard, 
  Calendar, 
  ShieldAlert, 
  Loader2, 
  Compass,
  ArrowRight,
  Phone
} from 'lucide-react';
import bookingService from '../../services/bookingService';

const BookingModal = ({ isOpen, onClose, tour, quantity, totalPrice, user, onSuccess }) => {
  const [phone, setPhone] = useState(user?.phone || '');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('vietqr');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.phone && !phone) {
      setPhone(user.phone);
    }
  }, [user]);

  if (!isOpen || !tour) return null;

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      setError(null);

      const cleanPhone = phone.trim();
      if (!cleanPhone) {
        setError('Vui lòng nhập số điện thoại để công ty liên hệ khi khởi hành!');
        setLoading(false);
        return;
      }

      // Gọi API Backend Node.js POST /api/bookings/create
      const response = await bookingService.createBooking({
        tourId: tour._id,
        numBookedSeats: Number(quantity),
        paymentMethod,
        phone: cleanPhone
      });

      const newBooking = response.data || response;

      if (onSuccess) {
        onSuccess(newBooking);
      } else {
        // Chuyển hướng sang trang thanh toán kèm phương thức đã chọn
        navigate(`/bookings/payment/${newBooking._id || newBooking.id}?method=${paymentMethod}`);
      }
    } catch (err) {
      console.error('Lỗi tạo booking:', err);
      // Hiển thị chính xác thông báo lỗi từ Backend (ví dụ tour không đủ chỗ)
      const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Không thể tạo đơn đặt tour. Vui lòng thử lại!';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '540px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header Modal */}
        <div style={{
          padding: '20px 24px',
          backgroundColor: '#0284c7',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Compass size={22} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Xác Nhận Đặt Tour Du Lịch</h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', maxHeight: 'calc(85vh - 120px)', overflowY: 'auto' }}>
          {/* Error Message */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '13px',
              marginBottom: '20px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '2px' }}>Không thể đặt tour:</strong>
                {error}
              </div>
            </div>
          )}

          {/* Chi tiết đơn tóm tắt */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
              Tour du lịch đã chọn
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', lineHeight: 1.4 }}>
              {tour.title}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748b' }}>Số lượng khách:</span>
                <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <Users size={14} color="#0284c7" /> {quantity} người
                </div>
              </div>

              <div>
                <span style={{ color: '#64748b' }}>Đơn giá vé:</span>
                <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                  {formatVND(tour.price)}
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '14px',
              paddingTop: '12px',
              borderTop: '1px dashed #cbd5e1',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>Tổng tiền thanh toán:</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#0284c7' }}>
                {formatVND(totalPrice)}
              </span>
            </div>
          </div>

          {/* Thông tin người đặt */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
              Thông tin người đặt (Trích xuất từ tài khoản):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div style={{ padding: '10px 12px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Họ và tên:</span>
                <strong style={{ color: '#0f172a' }}>{user?.name || 'Khách hàng'}</strong>
              </div>
              <div style={{ padding: '10px 12px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Email liên hệ:</span>
                <strong style={{ color: '#0f172a', wordBreak: 'break-all' }}>{user?.email}</strong>
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Số điện thoại liên lạc khi đi tour <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="tel"
                  placeholder="0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Lựa chọn phương thức thanh toán */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Phương thức thanh toán mong muốn:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { id: 'vietqr', label: 'Chuyển khoản (VietQR)' },
                { id: 'office', label: 'Tại văn phòng' },
                { id: 'momo', label: 'Ví MoMo' },
                { id: 'paypal', label: 'PayPal / Thẻ QT' },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: paymentMethod === m.id ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    backgroundColor: paymentMethod === m.id ? '#f0f9ff' : '#ffffff',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: paymentMethod === m.id ? 700 : 500,
                    color: paymentMethod === m.id ? '#0284c7' : '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#64748b',
            backgroundColor: '#eff6ff',
            padding: '10px 12px',
            borderRadius: '8px'
          }}>
            <ShieldAlert size={16} color="#0284c7" style={{ flexShrink: 0 }} />
            <span>Sau khi tạo booking thành công, bạn sẽ được chuyển sang trang thanh toán theo phương thức đã chọn.</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              fontWeight: 600,
              color: '#475569',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Quay lại
          </button>

          <button
            type="button"
            onClick={handleConfirmBooking}
            disabled={loading}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              backgroundColor: loading ? '#93c5fd' : '#0284c7',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              color: '#ffffff',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Đang xử lý đặt tour...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Xác Nhận Đặt Tour
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
