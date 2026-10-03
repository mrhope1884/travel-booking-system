import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import tourService from '../../services/tourService';
import ConfirmModal from '../../components/admin/ConfirmModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';

const TrashTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTour, setSelectedTour] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDestroyModal, setShowDestroyModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const fetchTrash = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await tourService.getTrashTours();
      setTours(res.data || []);
    } catch (err) {
      console.error('Lỗi khi tải thùng rác:', err);
      setError(err.response?.data?.message || err.message || 'Không thể tải danh sách tour trong thùng rác.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestoreConfirm = async () => {
    if (!selectedTour) return;
    try {
      setActionLoading(true);
      await tourService.restoreTour(selectedTour._id);
      setShowRestoreModal(false);
      setToast({ type: 'success', title: 'Thành công', message: 'Đã khôi phục tour thành công!' });
      fetchTrash();
    } catch (err) {
      setToast({ type: 'error', title: 'Thất bại', message: err.message || 'Lỗi khi khôi phục tour!' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDestroyConfirm = async () => {
    if (!selectedTour) return;
    try {
      setActionLoading(true);
      await tourService.destroyTour(selectedTour._id);
      setShowDestroyModal(false);
      setToast({ type: 'success', title: 'Đã xóa vĩnh viễn', message: 'Đã xóa vĩnh viễn tour khỏi cơ sở dữ liệu!' });
      fetchTrash();
    } catch (err) {
      setToast({ type: 'error', title: 'Thất bại', message: err.message || 'Lỗi khi xóa vĩnh viễn tour!' });
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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/admin/tours')}
            style={{
              background: 'none',
              border: '1px solid #d2d6de',
              borderRadius: '4px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#555',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            <ArrowLeft size={16} />
            <span>Quay lại Tours</span>
          </button>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#333', margin: 0 }}>
              Thùng rác Tours
            </h2>
            <span style={{ fontSize: '12px', color: '#888' }}>
              Có <strong>{tours.length}</strong> tour đang ở trong thùng rác
            </span>
          </div>
        </div>
      </div>

      {/* Trash Table */}
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
          <LoadingSpinner minHeight="260px" text="Đang tải danh sách thùng rác..." />
        ) : error ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#dc3545' }}>
            <p>❌ {error}</p>
          </div>
        ) : tours.length === 0 ? (
          <EmptyState message="Thùng rác trống. Không có tour nào bị xóa." />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#fafbfc', borderBottom: '1px solid #eee', color: '#666' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Tên tour</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, width: '130px' }}>Giá vé</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, width: '140px' }}>Thời gian xóa</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, width: '180px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {tours.map((tour) => (
                  <tr key={tour._id} style={{ borderBottom: '1px solid #f2f4f6' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#444' }}>{tour.title}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#e53935' }}>
                      {formatVND(tour.price)} đ
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', color: '#888' }}>
                      {tour.deletedAt ? new Date(tour.deletedAt).toLocaleString('vi-VN') : 'N/A'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <button
                          onClick={() => {
                            setSelectedTour(tour);
                            setShowRestoreModal(true);
                          }}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#00a65a',
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
                          <RotateCcw size={13} />
                          <span>Khôi phục</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTour(tour);
                            setShowDestroyModal(true);
                          }}
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
                          <span>Xóa vĩnh viễn</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Restore */}
      <ConfirmModal
        isOpen={showRestoreModal}
        title="Khôi phục Tour"
        message={`Bạn có chắc chắn muốn khôi phục tour "${selectedTour?.title}" trở lại danh sách hoạt động?`}
        confirmText="Khôi phục"
        cancelText="Hủy bỏ"
        onConfirm={handleRestoreConfirm}
        onCancel={() => setShowRestoreModal(false)}
        isLoading={actionLoading}
        isDanger={false}
      />

      {/* Confirm Destroy */}
      <ConfirmModal
        isOpen={showDestroyModal}
        title="Xóa vĩnh viễn Tour"
        message={`CẢNH BÁO: Bạn đang yêu cầu xóa vĩnh viễn tour "${selectedTour?.title}" khỏi cơ sở dữ liệu. Thao tác này KHÔNG THỂ khôi phục lại!`}
        confirmText="Xóa vĩnh viễn"
        cancelText="Hủy bỏ"
        onConfirm={handleDestroyConfirm}
        onCancel={() => setShowDestroyModal(false)}
        isLoading={actionLoading}
        isDanger={true}
      />
    </div>
  );
};

export default TrashTours;
