import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Users, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Filter, 
  Compass, 
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Tag
} from 'lucide-react';
import tourService from '../../services/tourService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

// Helper hình ảnh du lịch phong phú phù hợp cho từng tour
const getTourCoverImage = (tour) => {
  if (tour.imageCover && tour.imageCover !== 'default-tour.jpg') {
    return tour.imageCover;
  }
  const title = (tour.title || '').toUpperCase();
  if (title.includes('HẠ LONG')) return 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80';
  if (title.includes('FANSIPAN') || title.includes('SAPA')) return 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80';
  if (title.includes('MÙ CANG CHẢI')) return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80';
  if (title.includes('ĐÀ NẴNG') || title.includes('BÀ NÀ') || title.includes('HỘI AN')) return 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80';
  if (title.includes('PHÚ QUỐC')) return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80';
  if (title.includes('NINH BÌNH')) return 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80';
  if (title.includes('HUẾ')) return 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&q=80';
  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80';
};

const getDestinationRegion = (title) => {
  const upper = (title || '').toUpperCase();
  if (upper.includes('HẠ LONG') || upper.includes('SAPA') || upper.includes('FANSIPAN') || upper.includes('MÙ CANG CHẢI') || upper.includes('HÀ NỘI') || upper.includes('NINH BÌNH')) {
    return 'Miền Bắc';
  }
  if (upper.includes('ĐÀ NẴNG') || upper.includes('HUẾ') || upper.includes('HỘI AN') || upper.includes('QUY NHƠN') || upper.includes('NHA TRANG') || upper.includes('ĐÀ LẠT') || upper.includes('PHÚ YÊN')) {
    return 'Miền Trung';
  }
  return 'Miền Nam';
};

const TourList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Pagination state
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || 'ALL');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await tourService.getAllTours({
        page,
        limit: 9,
        query: query.trim() || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        region: selectedRegion !== 'ALL' ? selectedRegion : undefined,
      });

      let data = res.data || [];
      // Lọc theo khu vực (ưu tiên trường region từ database, nếu tour cũ chưa có thì dùng helper)
      if (selectedRegion !== 'ALL') {
        data = data.filter((t) => (t.region || getDestinationRegion(t.title)) === selectedRegion);
      }

      setTours(data);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || data.length);
    } catch (err) {
      console.error('Lỗi khi tải danh sách tour:', err);
      setError('Không thể kết nối đến máy chủ tour. Vui lòng kiểm tra lại!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [page, selectedRegion]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTours();
  };

  const handleResetFilters = () => {
    setQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedRegion('ALL');
    setPage(1);
    setSearchParams({});
    fetchTours();
  };

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  return (
    <div>
      {/* Hero Banner Tìm Kiếm */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 60%, #0284c7 100%)',
        color: '#ffffff',
        padding: '60px 24px 70px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(4px)',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            <Sparkles size={14} color="#fde047" /> Tour Du Lịch Chất Lượng Cao 2026
          </span>
          <h1 style={{ fontSize: '38px', fontWeight: 800, marginBottom: '12px', lineHeight: 1.25, letterSpacing: '-0.5px' }}>
            Khám Phá Danh Thắng Việt Nam Cùng Travel Việt
          </h1>
          <p style={{ fontSize: '16px', color: '#e0f2fe', marginBottom: '32px', lineHeight: 1.5 }}>
            Hơn 20+ hành trình độc đáo, dịch vụ trọn gói chuẩn 4-5 sao, đặt tour giữ chỗ tức thì!
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '8px',
            boxShadow: '0 20px 35px rgba(0,0,0,0.15)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            alignItems: 'center'
          }}>
            <div style={{ flex: '1 1 280px', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '16px' }} />
              <input
                type="text"
                placeholder="Tìm tour theo tên hoặc điểm đến (Hạ Long, Sapa, Đà Nẵng...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  color: '#0f172a',
                  borderRadius: '12px'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0369a1'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
            >
              <Search size={18} />
              Tìm Kiếm Tour
            </button>
          </form>
        </div>
      </section>

      {/* Main Container */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Filter Toolbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px',
          paddingBottom: '20px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          {/* Region Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'Tất cả điểm đến' },
              { id: 'Miền Bắc', label: 'Miền Bắc' },
              { id: 'Miền Trung', label: 'Miền Trung' },
              { id: 'Miền Nam', label: 'Miền Nam & Đảo' },
            ].map((region) => (
              <button
                key={region.id}
                onClick={() => { setSelectedRegion(region.id); setPage(1); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '30px',
                  fontSize: '13px',
                  fontWeight: selectedRegion === region.id ? 700 : 500,
                  border: selectedRegion === region.id ? '1px solid #0284c7' : '1px solid #cbd5e1',
                  backgroundColor: selectedRegion === region.id ? '#0284c7' : '#ffffff',
                  color: selectedRegion === region.id ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {region.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>
              Hiển thị <strong style={{ color: '#0f172a' }}>{tours.length}</strong> / {total} tour đang mở bán
            </span>
            {(query || minPrice || maxPrice || selectedRegion !== 'ALL') && (
              <button
                onClick={handleResetFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  fontSize: '12px',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <RotateCcw size={13} /> Đặt lại bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Loading / Error / Empty States */}
        {loading ? (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <LoadingSpinner text="Đang tải danh sách các tour du lịch..." />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ color: '#dc2626', fontSize: '16px', marginBottom: '16px' }}>{error}</div>
            <button
              onClick={fetchTours}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Thử lại
            </button>
          </div>
        ) : tours.length === 0 ? (
          <EmptyState
            title="Không tìm thấy tour phù hợp"
            description="Hiện không có tour nào khớp với tiêu chí tìm kiếm của bạn. Hãy thử thay đổi từ khóa hoặc bộ lọc."
            actionText="Xem tất cả các tour"
            onAction={handleResetFilters}
          />
        ) : (
          /* Grid Tour Cards */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '28px'
          }}>
            {tours.map((tour) => {
              const coverImg = getTourCoverImage(tour);
              const region = tour.region || getDestinationRegion(tour.title);
              const remaining = tour.maxGroupSize ?? 0;

              return (
                <div
                  key={tour._id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 16px 30px rgba(2, 132, 199, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.04)';
                  }}
                >
                  {/* Image Cover Container */}
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                    <img
                      src={coverImg}
                      alt={tour.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />

                    {/* Badge Vùng miền */}
                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <MapPin size={12} color="#38bdf8" /> {region}
                    </div>

                    {/* Badge Số chỗ còn trống */}
                    <div style={{
                      position: 'absolute',
                      bottom: '14px',
                      right: '14px',
                      backgroundColor: remaining > 5 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.95)',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Users size={12} /> Còn {remaining} chỗ
                    </div>
                  </div>

                  {/* Content Container */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{
                      fontSize: '17px',
                      fontWeight: 700,
                      color: '#0f172a',
                      lineHeight: 1.4,
                      marginBottom: '10px',
                      minHeight: '48px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {tour.title}
                    </h3>

                    <p style={{
                      fontSize: '13px',
                      color: '#64748b',
                      lineHeight: 1.5,
                      marginBottom: '18px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1
                    }}>
                      {tour.description}
                    </p>

                    {/* Highlights row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '12px',
                      color: '#475569',
                      paddingTop: '12px',
                      borderTop: '1px solid #f1f5f9',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} color="#0284c7" /> Trọn gói 3N2Đ - 4N3Đ
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} color="#10b981" /> Hướng dẫn viên
                      </div>
                    </div>

                    {/* Price & Action Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto'
                    }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Giá chỉ từ:</span>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#0284c7' }}>
                          {formatVND(tour.price)}
                        </div>
                      </div>

                      <Link
                        to={`/tours/${tour._id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 18px',
                          borderRadius: '10px',
                          backgroundColor: '#0284c7',
                          color: '#ffffff',
                          fontSize: '13px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0369a1'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
                      >
                        Xem & Đặt
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '48px' }}>
            <button
              disabled={page <= 1}
              onClick={() => { setPage(page - 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: page <= 1 ? '#94a3b8' : '#334155',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '13px'
              }}
            >
              Trang trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => { setPage(p); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  border: page === p ? '1px solid #0284c7' : '1px solid #cbd5e1',
                  backgroundColor: page === p ? '#0284c7' : '#ffffff',
                  color: page === p ? '#ffffff' : '#334155',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page >= totalPages}
              onClick={() => { setPage(page + 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: page >= totalPages ? '#94a3b8' : '#334155',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '13px'
              }}
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourList;
