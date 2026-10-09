import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Copy, 
  Building2, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  Users,
  Compass,
  FileText
} from 'lucide-react';
import bookingService from '../../services/bookingService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const methodFromQuery = searchParams.get('method');

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(methodFromQuery || 'vietqr');
  const [copied, setCopied] = useState(false);
  const [savingMethod, setSavingMethod] = useState(false);
  const [methodMessage, setMethodMessage] = useState(null);

  const getMethodLabel = (m) => {
    switch (m) {
      case 'office': return 'Thanh toán tại văn phòng';
      case 'vietqr': return 'Chuyển khoản (VietQR)';
      case 'momo': return 'Ví điện tử MoMo';
      case 'paypal': return 'PayPal & Thẻ quốc tế';
      default: return m || 'Tại văn phòng';
    }
  };

  const handleSelectMethod = async (newMethod) => {
    if (newMethod === selectedMethod) return;
    setSelectedMethod(newMethod);
    navigate(`/bookings/payment/${bookingId}?method=${newMethod}`, { replace: true });

    try {
      setSavingMethod(true);
      await bookingService.updatePaymentMethod(bookingId, newMethod);
      setBooking((prev) => prev ? { ...prev, paymentMethod: newMethod } : prev);
      setMethodMessage(`✓ Đã đổi sang: ${getMethodLabel(newMethod)}`);
      setTimeout(() => setMethodMessage(null), 3000);
    } catch (err) {
      console.warn('Lưu phương thức thanh toán lên server:', err);
    } finally {
      setSavingMethod(false);
    }
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await bookingService.getBookingById(bookingId);
        const bData = res.data || res;
        setBooking(bData);
        if (!methodFromQuery && bData.paymentMethod) {
          setSelectedMethod(bData.paymentMethod);
        }
      } catch (err) {
        console.error('Lỗi tải booking:', err);
        setError(err.response?.data?.message || err.message || 'Không thể tải thông tin đơn đặt tour.');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ padding: '120px 24px', textAlign: 'center' }}>
        <LoadingSpinner text="Đang tải thông tin đơn đặt chỗ..." />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
          {error || 'Không tìm thấy đơn đặt tour'}
        </h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>
          Vui lòng kiểm tra lại mã đơn đặt chỗ hoặc truy cập trang quản lý đơn của bạn.
        </p>
        <Link
          to="/bookings"
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          Xem đơn của tôi
        </Link>
      </div>
    );
  }

  const tourTitle = booking.tour?.title || 'Tour du lịch';
  const seats = booking.numBookedSeats || 1;
  const totalPrice = booking.price || 0;
  const bookingCode = (booking._id || booking.id || '').toUpperCase();
  const transferContent = `DATTOUR ${bookingCode.slice(-6)}`;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 24px 80px' }}>
      {/* Steps Progress Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
            ✓
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>1. Chọn Tour</span>
        </div>

        <div style={{ width: '60px', height: '2px', backgroundColor: '#10b981', margin: '0 12px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
            ✓
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>2. Xác Nhận</span>
        </div>

        <div style={{ width: '60px', height: '2px', backgroundColor: '#0284c7', margin: '0 12px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
            3
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0284c7' }}>3. Thanh Toán</span>
        </div>
      </div>

      {/* Success Notification Alert */}
      <div style={{
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CheckCircle2 size={26} color="#16a34a" />
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#166534', margin: '0 0 4px 0' }}>
            Đặt Tour Thành Công! Chỗ của bạn đã được giữ an toàn.
          </h2>
          <p style={{ fontSize: '13px', color: '#15803d', margin: 0 }}>
            Mã đơn đặt tour của bạn là: <strong style={{ color: '#0f172a', letterSpacing: '0.5px' }}>#{bookingCode}</strong>. Vui lòng hoàn tất thanh toán để nhận vé xác nhận chính thức.
          </p>
        </div>
      </div>

      {/* Hướng dẫn xác nhận thanh toán */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '12px 18px',
        marginBottom: '24px',
        fontSize: '13px',
        color: '#475569',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <ShieldCheck size={18} color="#0284c7" style={{ flexShrink: 0 }} />
        <span>
          <strong>Lưu ý:</strong> Sau khi hoàn tất thanh toán hoặc chuyển khoản, hệ thống và nhân viên tư vấn sẽ kiểm tra và xác nhận đơn của bạn trong vòng 5 - 15 phút.
        </span>
      </div>

      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Left Column: Chọn Phương Thức Thanh Toán */}
        <div>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '28px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Chọn Phương Thức Thanh Toán
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
              Vui lòng chọn hình thức thanh toán thuận tiện nhất cho bạn
            </p>

            {/* Thông báo khi đổi phương thức thành công */}
            {methodMessage && (
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                color: '#166534',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span>{methodMessage}</span>
              </div>
            )}

            {/* Methods options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Option 1: VietQR */}
              <div
                onClick={() => handleSelectMethod('vietqr')}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: selectedMethod === 'vietqr' ? '2px solid #0284c7' : '1px solid #e2e8f0',
                  backgroundColor: selectedMethod === 'vietqr' ? '#f0f9ff' : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={22} color="#0284c7" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>Chuyển khoản Ngân hàng (VietQR)</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Quét mã QR qua ứng dụng ngân hàng bất kỳ, tự động điền số tiền</div>
                  </div>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: selectedMethod === 'vietqr' ? '6px solid #0284c7' : '2px solid #cbd5e1',
                  backgroundColor: '#ffffff'
                }} />
              </div>

              {/* Option 2: MoMo */}
              <div
                onClick={() => handleSelectMethod('momo')}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: selectedMethod === 'momo' ? '2px solid #a21caf' : '1px solid #e2e8f0',
                  backgroundColor: selectedMethod === 'momo' ? '#fdf4ff' : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#fae8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={22} color="#a21caf" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>Ví Điện Tử MoMo</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Thanh toán tức thì qua ví điện tử MoMo trên điện thoại</div>
                  </div>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: selectedMethod === 'momo' ? '6px solid #a21caf' : '2px solid #cbd5e1',
                  backgroundColor: '#ffffff'
                }} />
              </div>

              {/* Option 3: PayPal / Thẻ quốc tế */}
              <div
                onClick={() => handleSelectMethod('paypal')}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: selectedMethod === 'paypal' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: selectedMethod === 'paypal' ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={22} color="#2563eb" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>PayPal & Thẻ Quốc Tế (Visa/Mastercard)</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Hỗ trợ thẻ tín dụng, ghi nợ quốc tế bảo mật toàn cầu</div>
                  </div>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: selectedMethod === 'paypal' ? '6px solid #2563eb' : '2px solid #cbd5e1',
                  backgroundColor: '#ffffff'
                }} />
              </div>

              {/* Option 4: Văn phòng */}
              <div
                onClick={() => handleSelectMethod('office')}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: selectedMethod === 'office' ? '2px solid #d97706' : '1px solid #e2e8f0',
                  backgroundColor: selectedMethod === 'office' ? '#fffbeb' : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={22} color="#d97706" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>Thanh Toán Trực Tiếp Tại Văn Phòng</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Nộp tiền mặt hoặc quẹt thẻ tại trụ sở công ty lữ hành</div>
                  </div>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: selectedMethod === 'office' ? '6px solid #d97706' : '2px solid #cbd5e1',
                  backgroundColor: '#ffffff'
                }} />
              </div>
            </div>

            {/* Chi tiết theo phương thức đã chọn */}
            <div style={{ marginTop: '28px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              {selectedMethod === 'vietqr' && (
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>
                    Thông tin chuyển khoản ngân hàng:
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'center', marginBottom: '16px' }}>
                    {/* Thông tin tài khoản */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                      <div style={{ padding: '8px 12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Ngân hàng thụ hưởng:</span>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>Techcombank (Ngân hàng Kỹ thương Việt Nam)</div>
                      </div>

                      <div style={{ padding: '8px 12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Chủ tài khoản:</span>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>Vũ Viết Quân</div>
                      </div>

                      <div style={{ padding: '8px 12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Số tài khoản:</span>
                        <div style={{ fontWeight: 800, color: '#0284c7', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>3628998668</span>
                          <button
                            type="button"
                            onClick={() => handleCopy('3628998668')}
                            style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: '#0284c7', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                          >
                            <Copy size={13} /> Sao chép
                          </button>
                        </div>
                      </div>

                      <div style={{ padding: '8px 12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Nội dung chuyển khoản (bắt buộc):</span>
                        <div style={{ fontWeight: 800, color: '#dc2626', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>{transferContent}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(transferContent)}
                            style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: '#dc2626', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                          >
                            <Copy size={13} /> Sao chép
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Chuyển Khoản Tự Động */}
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                        Quét mã VietQR chuyển khoản nhanh:
                      </div>
                      <img
                        src={`https://img.vietqr.io/image/TCB-3628998668-compact2.png?amount=${totalPrice}&addInfo=${encodeURIComponent(transferContent)}&accountName=VU%20VIET%20QUAN`}
                        alt="Mã QR Chuyển Khoản Techcombank"
                        style={{ width: '180px', height: '180px', objectFit: 'contain', margin: '0 auto', display: 'block', borderRadius: '8px' }}
                      />
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                        Mở App Ngân hàng bất kỳ để quét mã
                      </div>
                    </div>
                  </div>

                  {copied && <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>✓ Đã sao chép vào bộ nhớ tạm!</span>}
                </div>
              )}

              {selectedMethod === 'momo' && (
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    Thanh toán qua Ví MoMo:
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                    Mở ứng dụng MoMo trên điện thoại, chọn <strong>"Chuyển tiền"</strong> đến số điện thoại: <strong>3628998668</strong> (Vũ Viết Quân) với nội dung: <strong style={{ color: '#dc2626' }}>{transferContent}</strong>.
                  </p>
                </div>
              )}

              {selectedMethod === 'paypal' && (
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    Thanh toán Quốc tế / PayPal:
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                    Hỗ trợ thanh toán qua tài khoản PayPal: <strong>vuvietquan1884@gmail.com</strong> hoặc kết nối cổng thanh toán quốc tế thẻ Visa/Mastercard.
                  </p>
                </div>
              )}

              {selectedMethod === 'office' && (
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    Địa chỉ Văn phòng Giao dịch:
                  </h4>
                  <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                    <strong>Hà Nội:</strong> 23 Hoàng Xá, Quốc Oai, Hà Nội | Hotline: 0868236611<br />
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Tóm tắt đơn & Trạng thái */}
        <div>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '28px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            position: 'sticky',
            top: '96px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
              Tóm Tắt Đơn Đặt Tour
            </h3>

            {/* Tour Title */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Tên tour</span>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginTop: '2px' }}>
                {tourTitle}
              </div>
            </div>

            {/* Meta details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Mã đơn đặt chỗ:</span>
                <strong style={{ color: '#0f172a' }}>#{bookingCode.slice(-8)}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Số lượng vé:</span>
                <strong style={{ color: '#0f172a' }}>{seats} khách</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Người đặt:</span>
                <strong style={{ color: '#0f172a' }}>{booking.user?.name || 'Khách hàng'}</strong>
              </div>

              {/* Status Section: Clear Distinction Between Booking Status and Payment Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b' }}>Trạng thái đặt chỗ:</span>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: booking.status === 'confirmed' ? '#dcfce7' : '#fee2e2',
                  color: booking.status === 'confirmed' ? '#166534' : '#991b1b'
                }}>
                  {booking.status === 'confirmed' ? '✓ Đã xác nhận' : 'Đã hủy'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b' }}>Trạng thái thanh toán:</span>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: booking.status === 'cancelled' ? '#f1f5f9' : booking.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7',
                  color: booking.status === 'cancelled' ? '#64748b' : booking.paymentStatus === 'paid' ? '#166534' : '#92400e'
                }}>
                  {booking.status === 'cancelled' ? 'Đã hủy đơn' : booking.paymentStatus === 'paid' ? '✓ Đã thanh toán' : '⏳ Chờ thanh toán'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b' }}>Hình thức thanh toán:</span>
                <span style={{
                  fontWeight: 700,
                  color: '#0284c7',
                  fontSize: '12px',
                  backgroundColor: '#f0f9ff',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  {getMethodLabel(booking.paymentMethod || selectedMethod)}
                </span>
              </div>
            </div>

            {/* Total Price */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#334155' }}>Tổng số tiền:</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#0284c7' }}>
                {formatVND(totalPrice)}
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              <Link
                to="/bookings"
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '10px',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <FileText size={16} />
                Xem Quản Lý Đơn Của Tôi
              </Link>

              <Link
                to="/tours"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '14px',
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                Tiếp Tục Khám Phá Tour
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
