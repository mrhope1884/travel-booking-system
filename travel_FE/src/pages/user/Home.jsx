import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Compass, 
  ShieldCheck, 
  Clock, 
  Award, 
  ArrowRight, 
  Sparkles, 
  Star, 
  Users, 
  Calendar,
  CheckCircle2,
  TrendingUp,
  Headphones,
  Phone,
  Mail
} from 'lucide-react';
import tourService from '../../services/tourService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Helper chọn ảnh đẹp cho tour
const getTourCoverImage = (tour) => {
  if (tour.imageCover && tour.imageCover !== 'default-tour.jpg') {
    return tour.imageCover;
  }
  const title = (tour.title || '').toUpperCase();
  if (title.includes('HẠ LONG')) return 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80';
  if (title.includes('FANSIPAN') || title.includes('SAPA')) return 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80';
  if (title.includes('ĐÀ NẴNG') || title.includes('BÀ NÀ') || title.includes('HỘI AN')) return 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80';
  if (title.includes('PHÚ QUỐC')) return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80';
  if (title.includes('NINH BÌNH')) return 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80';
  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80';
};

const Home = () => {
  const navigate = useNavigate();
  const [featuredTours, setFeaturedTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search box state
  const [keyword, setKeyword] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const data = await tourService.getFeaturedTours();
        setFeaturedTours(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Lỗi tải tour nổi bật:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('query', keyword.trim());
    if (selectedRegion !== 'ALL') params.append('region', selectedRegion);
    navigate(`/tours?${params.toString()}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  // Top điểm đến yêu thích
  const destinations = [
    { name: 'Vịnh Hạ Long', region: 'Miền Bắc', img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80', count: '12 Tours' },
    { name: 'Đà Nẵng - Hội An', region: 'Miền Trung', img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80', count: '18 Tours' },
    { name: 'Sapa - Fansipan', region: 'Miền Bắc', img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&q=80', count: '8 Tours' },
    { name: 'Đảo Ngọc Phú Quốc', region: 'Miền Nam', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', count: '15 Tours' }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* 1. HERO BANNER SECTION */}
      <section style={{
        position: 'relative',
        minHeight: '580px',
        background: 'linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)), url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=85") center/cover no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '70px 24px',
        color: '#ffffff'
      }}>
        <div style={{ maxWidth: '960px', width: '100%', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            padding: '6px 18px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '20px',
            letterSpacing: '0.5px'
          }}>
            <Sparkles size={16} color="#38bdf8" /> Khám phá vẻ đẹp Việt Nam cùng Travel Việt
          </div>

          <h1 style={{
            fontSize: '44px',
            fontWeight: 900,
            lineHeight: 1.25,
            marginBottom: '18px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Hành Trình Vạn Dặm <br /><span style={{ color: '#38bdf8' }}>Bắt Đầu Từ Chuyến Đi Của Bạn</span>
          </h1>

          <p style={{
            fontSize: '16px',
            color: '#cbd5e1',
            maxWidth: '650px',
            margin: '0 auto 36px',
            lineHeight: 1.6
          }}>
            Trải nghiệm các tour du lịch trọn gói hàng đầu với mức giá tốt nhất, hướng dẫn viên chuyên nghiệp và dịch vụ tận tâm 24/7.
          </p>

          {/* Quick Search Box */}
          <form onSubmit={handleQuickSearch} style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            maxWidth: '750px',
            margin: '0 auto',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px' }}>
              <Search size={18} color="#0284c7" />
              <input
                type="text"
                placeholder="Bạn muốn đi đâu? (Hạ Long, Sapa, Đà Nẵng...)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '14px',
                  color: '#0f172a'
                }}
              />
            </div>

            <div style={{ width: '1px', height: '30px', backgroundColor: '#e2e8f0' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '150px' }}>
              <MapPin size={18} color="#0284c7" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  color: '#334155',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                <option value="ALL">Tất cả vùng miền</option>
                <option value="Miền Bắc">Miền Bắc</option>
                <option value="Miền Trung">Miền Trung</option>
                <option value="Miền Nam">Miền Nam</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0369a1'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
            >
              Tìm Tour Ngay <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* 2. STATS COUNTER */}
      <section style={{ backgroundColor: '#f8fafc', padding: '36px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0284c7' }}>15,000+</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Du khách hài lòng</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0284c7' }}>50+</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Tour du lịch đa dạng</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0284c7' }}>99%</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Đánh giá 5 sao</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0284c7' }}>24/7</div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Hỗ trợ tận tâm</div>
          </div>
        </div>
      </section>

      {/* 3. TOP ĐIỂM ĐẾN PHỔ BIẾN */}
      <section style={{ padding: '64px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '13px', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Khám phá vẻ đẹp
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', margin: '6px 0 0 0' }}>
            Điểm Đến Được Yêu Thích Nhất
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {destinations.map((dest, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/tours?query=${encodeURIComponent(dest.name.split(' ')[0])}`)}
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                height: '280px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
              }}
            >
              <img
                src={dest.img}
                alt={dest.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, transparent 60%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '20px',
                color: '#ffffff'
              }}>
                <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                  {dest.region}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0' }}>{dest.name}</h3>
                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>{dest.count} đang mở</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TOUR NỔI BẬT (FEATURED TOURS) */}
      <section style={{ padding: '64px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '13px', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Trải nghiệm đặc sắc
              </span>
              <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', margin: '6px 0 0 0' }}>
                Tour Nổi Bật Bán Chạy Nhất
              </h2>
            </div>
            <Link
              to="/tours"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#0284c7',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none'
              }}
            >
              Xem tất cả tour <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
              <LoadingSpinner text="Đang tải danh sách tour nổi bật..." />
            </div>
          ) : featuredTours.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              Hiện chưa có tour nổi bật nào.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
              {featuredTours.map((tour) => {
                const availableSeats = tour.maxGroupSize ?? 20;
                return (
                  <div
                    key={tour._id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', height: '200px' }}>
                      <img
                        src={getTourCoverImage(tour)}
                        alt={tour.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '20px'
                      }}>
                        {tour.region || 'Miền Bắc'}
                      </span>
                      <span style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(4px)',
                        color: '#38bdf8',
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Users size={13} /> Còn {availableSeats} chỗ
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '8px',
                        lineHeight: 1.4,
                        minHeight: '44px'
                      }}>
                        {tour.title}
                      </h3>

                      <p style={{
                        fontSize: '13px',
                        color: '#64748b',
                        marginBottom: '16px',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {tour.description}
                      </p>

                      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Giá trọn gói từ</div>
                          <div style={{ fontSize: '18px', fontWeight: 800, color: '#dc2626' }}>
                            {formatPrice(tour.price)}
                          </div>
                        </div>

                        <Link
                          to={`/tours/${tour._id}`}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#0284c7',
                            color: '#ffffff',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            textDecoration: 'none'
                          }}
                        >
                          Chi Tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 5. VÌ SAO CHỌN CHÚNG TÔI (WHY CHOOSE US) */}
      <section style={{ padding: '64px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '13px', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Cam kết chất lượng
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', margin: '6px 0 0 0' }}>
            Tại Sao Nên Đồng Hành Cùng Travel Việt?
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px' }}>
          <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#16a34a' }}>
              <Award size={26} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>Giá Luôn Tốt Nhất</h3>
            <p style={{ fontSize: '13px', color: '#15803d', margin: 0 }}>Cam kết mức giá cạnh tranh nhất đi kèm dịch vụ đạt chuẩn chất lượng cao.</p>
          </div>

          <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#0284c7' }}>
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0369a1', marginBottom: '8px' }}>Đảm Bảo Giữ Chỗ 100%</h3>
            <p style={{ fontSize: '13px', color: '#0284c7', margin: 0 }}>Đặt tour giữ chỗ ngay tức thì, chính sách hoàn hủy minh bạch, rõ ràng.</p>
          </div>

          <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#fefce8', border: '1px solid #fef08a', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#ca8a04' }}>
              <Compass size={26} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#854d0e', marginBottom: '8px' }}>Lịch Trình Hấp Dẫn</h3>
            <p style={{ fontSize: '13px', color: '#a16207', margin: 0 }}>Được thiết kế tinh tế bởi đội ngũ chuyên gia du lịch am hiểu văn hóa địa phương.</p>
          </div>

          <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#9333ea' }}>
              <Headphones size={26} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#6b21a8', marginBottom: '8px' }}>Hỗ Trợ 24/7</h3>
            <p style={{ fontSize: '13px', color: '#7e22ce', margin: 0 }}>Luôn sẵn sàng giải đáp và tư vấn hành trình qua Hotline 1900 6868 bất kể thời gian.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
