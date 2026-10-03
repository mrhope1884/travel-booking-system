import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  Users, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  CreditCard, 
  Compass, 
  Share2, 
  AlertCircle,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import tourService from '../../services/tourService';
import { useAuth } from '../../context/AuthContext';
import BookingModal from '../../components/user/BookingModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const getTourCoverImage = (tour) => {
  if (tour.imageCover && tour.imageCover !== 'default-tour.jpg') {
    return tour.imageCover;
  }
  const title = (tour.title || '').toUpperCase();
  if (title.includes('HẠ LONG')) return 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80';
  if (title.includes('FANSIPAN') || title.includes('SAPA')) return 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80';
  if (title.includes('MÙ CANG CHẢI')) return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80';
  if (title.includes('ĐÀ NẴNG') || title.includes('BÀ NÀ') || title.includes('HỘI AN')) return 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80';
  if (title.includes('PHÚ QUỐC')) return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80';
  if (title.includes('NINH BÌNH')) return 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80';
  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80';
};

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking widget state
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await tourService.getTourById(id);
        setTour(data);
      } catch (err) {
        console.error('Lỗi tải chi tiết tour:', err);
        setError(err.message || 'Không tìm thấy tour du lịch này.');
      } finally {
        setLoading(false);
      }
    };

    fetchTourDetail();
  }, [id]);

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const handleBookNowClick = () => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      // Chuyển hướng tới trang Login kèm URL redirect
      navigate(`/login?redirect=/tours/${id}`);
      return;
    }

    // Mở modal xác nhận đặt tour
    setIsModalOpen(true);
  };

  const remainingSeats = tour?.maxGroupSize ?? 0;
  const totalPrice = tour ? tour.price * quantity : 0;

  if (loading) {
    return (
      <div style={{ padding: '120px 24px', textAlign: 'center' }}>
        <LoadingSpinner text="Đang tải thông tin chi tiết tour..." />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
          {error || 'Tour không tồn tại'}
        </h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>
          Tour du lịch này có thể đã tạm dừng mở bán hoặc không tìm thấy mã tour.
        </p>
        <Link
          to="/tours"
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
          <ArrowLeft size={16} /> Quay lại danh sách tour
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
        <Link to="/tours" style={{ color: '#0284c7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={14} /> Danh sách tour
        </Link>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Chi tiết tour</span>
      </div>

      {/* Main Layout Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Left Column: Tour Detail Content */}
        <div>
          {/* Main Hero Image */}
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            height: '420px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            marginBottom: '28px'
          }}>
            <img
              src={getTourCoverImage(tour)}
              alt={tour.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '30px',
              fontSize: '12px',
              fontWeight: 700,
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Compass size={14} color="#38bdf8" /> Mã Tour: #{tour._id.slice(-6).toUpperCase()}
            </div>
          </div>

          {/* Title & Basic Info */}
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '16px' }}>
            {tour.title}
          </h1>

          {/* Quick Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} color="#0284c7" />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Thời gian</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>3 Ngày 2 Đêm</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} color="#16a34a" />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Số chỗ còn lại</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: remainingSeats > 0 ? '#16a34a' : '#dc2626' }}>
                  {remainingSeats > 0 ? `${remainingSeats} chỗ trống` : 'Đã hết chỗ'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={20} color="#d97706" />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Khởi hành</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Hàng tuần</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={20} color="#9333ea" />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Khu vực</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#9333ea' }}>{tour.region || 'Miền Bắc'}</div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
              Lịch Trình & Mô Tả Chi Tiết
            </h2>
            <div style={{ fontSize: '15px', lineHeight: 1.8, color: '#334155', whiteSpace: 'pre-line' }}>
              {tour.description}
            </div>
          </div>

          {/* Inclusions / Highlights */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '18px' }}>
              Dịch Vụ Bao Gồm Trong Tour
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {[
                'Xe du lịch đời mới đưa đón suốt hành trình',
                'Khách sạn tiêu chuẩn 3-4 sao tiện nghi',
                'Bữa ăn đặc sản theo chương trình',
                'Vé tham quan tất cả các thắng cảnh trong lịch trình',
                'Hướng dẫn viên nhiệt tình, chu đáo suốt tuyến',
                'Bảo hiểm du lịch quốc tế mức đền bù tối đa 50.000.000đ',
                'Nước uống, khăn lạnh phục vụ trên xe mỗi ngày'
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#334155' }}>
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div style={{ position: 'sticky', top: '96px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 12px 30px rgba(2, 132, 199, 0.08), 0 4px 12px rgba(0,0,0,0.03)',
            padding: '28px',
            overflow: 'hidden'
          }}>
            {/* Price header */}
            <div style={{ marginBottom: '20px', paddingBottom: '18px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Giá trọn gói mỗi khách
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#0284c7' }}>
                  {formatVND(tour.price)}
                </span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>/ vé</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                Chọn số lượng khách đặt vé:
              </label>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc'
              }}>
                <button
                  type="button"
                  disabled={quantity <= 1 || remainingSeats <= 0}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: quantity <= 1 ? '#94a3b8' : '#0f172a',
                    cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  -
                </button>

                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{quantity}</span>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>khách</span>
                </div>

                <button
                  type="button"
                  disabled={quantity >= remainingSeats || remainingSeats <= 0}
                  onClick={() => setQuantity(Math.min(remainingSeats, quantity + 1))}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: quantity >= remainingSeats ? '#94a3b8' : '#0f172a',
                    cursor: quantity >= remainingSeats ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  +
                </button>
              </div>

              {/* Remaining alert */}
              <div style={{ marginTop: '8px', fontSize: '12px', color: remainingSeats > 3 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                {remainingSeats > 0 ? (
                  `* Tour chỉ còn tối đa ${remainingSeats} chỗ trống`
                ) : (
                  '❌ Tour này đã hết chỗ đặt. Vui lòng chọn tour khác!'
                )}
              </div>
            </div>

            {/* Total Price Calculation */}
            <div style={{
              backgroundColor: '#f0f9ff',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              border: '1px solid #bae6fd'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#334155', marginBottom: '6px' }}>
                <span>Đơn giá ({quantity} vé):</span>
                <span>{formatVND(totalPrice)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '10px',
                borderTop: '1px solid #bae6fd',
                fontWeight: 800
              }}>
                <span style={{ fontSize: '14px', color: '#0c4a6e' }}>Tổng tiền:</span>
                <span style={{ fontSize: '22px', color: '#0284c7' }}>{formatVND(totalPrice)}</span>
              </div>
            </div>

            {/* Book Button */}
            <button
              type="button"
              disabled={remainingSeats <= 0}
              onClick={handleBookNowClick}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '12px',
                backgroundColor: remainingSeats <= 0 ? '#cbd5e1' : '#0284c7',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 700,
                border: 'none',
                cursor: remainingSeats <= 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: remainingSeats <= 0 ? 'none' : '0 4px 14px rgba(2, 132, 199, 0.4)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => { if (remainingSeats > 0) e.currentTarget.style.backgroundColor = '#0369a1'; }}
              onMouseLeave={(e) => { if (remainingSeats > 0) e.currentTarget.style.backgroundColor = '#0284c7'; }}
            >
              {remainingSeats <= 0 ? (
                'Tour Đã Hết Chỗ'
              ) : isAuthenticated ? (
                <>
                  <CreditCard size={18} />
                  Đặt Tour Ngay
                </>
              ) : (
                'Đăng Nhập Để Đặt Tour'
              )}
            </button>

            {/* Support guarantee */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="#0284c7" />
                <span>Giữ chỗ ngay lập tức & thanh toán an toàn</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneCall size={16} color="#0284c7" />
                <span>Hỗ trợ tư vấn đặt tour 24/7: <strong>1900 6868</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tour={tour}
          quantity={quantity}
          totalPrice={totalPrice}
          user={user}
        />
      )}
    </div>
  );
};

export default TourDetail;
