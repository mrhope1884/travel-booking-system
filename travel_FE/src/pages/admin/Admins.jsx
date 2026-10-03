import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Admins = () => {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      // Kết nối trực tiếp vào API Backend: GET /api/users?role=admin
      const data = await userService.getUsers({ role: 'admin' });
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách Admin:', err);
      setError(err.response?.data?.message || err.message || 'Không thể tải danh sách Quản trị viên.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e9ec',
          borderRadius: '4px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#e0f7fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00c0ef',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#333' }}>
                Quản lý Quản trị viên (Admin)
              </h2>
              <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0 0' }}>
                Danh sách tài khoản có đặc quyền quản trị cao nhất trên hệ thống ({admins.length} tài khoản)
              </p>
            </div>
          </div>

          <button
            onClick={fetchAdmins}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #d2d6de',
              backgroundColor: '#fff',
              fontSize: '12px',
              color: '#444',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <RefreshCw size={13} />
            <span>Làm mới</span>
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <LoadingSpinner text="Đang tải danh sách Admin từ Backend..." />
          </div>
        ) : error ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#dc3545' }}>
            <p>❌ {error}</p>
            <button
              onClick={fetchAdmins}
              style={{
                marginTop: '10px',
                padding: '6px 14px',
                backgroundColor: '#00c0ef',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#fafbfc', borderBottom: '1px solid #eee', color: '#666' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Tên Admin</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>Cấp quyền</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => {
                  const isCurrent = admin._id === (currentUser?.id || currentUser?._id) || admin.email === currentUser?.email;
                  return (
                    <tr key={admin._id} style={{ borderBottom: '1px solid #f2f4f6' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#333' }}>
                        {admin.name || 'Admin'} {isCurrent && <span style={{ color: '#00c0ef', fontSize: '11px' }}>(Bạn)</span>}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#555' }}>
                        {admin.email}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{ background: '#00c0ef', color: '#fff', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700 }}>
                          SUPER ADMIN
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{ background: admin.status === 'inactive' ? '#999' : '#00a65a', color: '#fff', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 600 }}>
                          {admin.status === 'inactive' ? 'Tạm khóa' : 'Đang hoạt động'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admins;
