import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Save, 
  KeyRound, 
  Camera, 
  Calendar,
  Sparkles
} from 'lucide-react';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/common/Toast';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
];

const Profile = () => {
  const { user: authUser } = useAuth();

  const [activeTab, setActiveTab] = useState('info'); // 'info' hoặc 'password'
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Form thông tin cá nhân
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  // Form đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Toast thông báo
  const [toast, setToast] = useState(null);

  // Tải dữ liệu hồ sơ từ API Backend GET /api/auth/profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      const userProfile = data.data || data;
      setProfile(userProfile);
      setName(userProfile.name || '');
      setPhone(userProfile.phone || '');
      setAvatar(userProfile.avatar && userProfile.avatar !== 'default-avatar.png' ? userProfile.avatar : AVATAR_OPTIONS[0]);
    } catch (err) {
      console.error('Lỗi tải thông tin hồ sơ:', err);
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Không thể tải thông tin hồ sơ cá nhân.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Xử lý cập nhật thông tin hồ sơ (PUT /api/auth/profile)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setToast({ type: 'error', message: 'Vui lòng nhập họ và tên của bạn!' });
      return;
    }

    try {
      setUpdateLoading(true);
      const res = await userService.updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        avatar: avatar.trim()
      });

      // Cập nhật lại thông tin hiển thị trong localStorage
      const updatedUser = res.data || { ...profile, name: name.trim(), phone: phone.trim(), avatar };
      const currentStored = JSON.parse(localStorage.getItem('user_info') || '{}');
      localStorage.setItem('user_info', JSON.stringify({ ...currentStored, ...updatedUser }));

      setProfile(updatedUser);
      setToast({
        type: 'success',
        message: '🎉 Cập nhật hồ sơ cá nhân thành công!'
      });
    } catch (err) {
      console.error('Lỗi cập nhật hồ sơ:', err);
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Không thể cập nhật hồ sơ. Vui lòng thử lại!'
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  // Xử lý đổi mật khẩu (PUT /api/auth/change-password)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setToast({ type: 'error', message: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới!' });
      return;
    }

    if (newPassword.length < 6) {
      setToast({ type: 'error', message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({ type: 'error', message: 'Xác nhận mật khẩu mới không trùng khớp!' });
      return;
    }

    try {
      setPasswordLoading(true);
      await userService.changePassword({
        currentPassword,
        newPassword
      });

      setToast({
        type: 'success',
        message: '🎉 Đổi mật khẩu thành công! Mật khẩu mới đã có hiệu lực.'
      });

      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Lỗi đổi mật khẩu:', err);
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Mật khẩu hiện tại không chính xác!'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 120px)', paddingBottom: '60px' }}>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '40px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            <Sparkles size={16} />
            Trung tâm tài khoản
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            Hồ Sơ Cá Nhân
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '15px' }}>
            Quản lý thông tin tài khoản, số điện thoại và bảo mật mật khẩu của bạn.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '-24px auto 0 auto', padding: '0 24px' }}>
        {loading ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '80px 20px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <Loader2 size={36} color="#0284c7" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }} />
            <div style={{ color: '#64748b', fontSize: '15px' }}>Đang tải thông tin hồ sơ của bạn...</div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            gap: '24px',
            alignItems: 'start'
          }} className="profile-layout-grid">
            
            {/* Cột trái: Tóm tắt thông tin tài khoản & Menu Tab */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '28px 24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0'
            }}>
              {/* Avatar & Tên */}
              <div style={{ textAlign: 'center', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 16px auto' }}>
                  <img
                    src={avatar || AVATAR_OPTIONS[0]}
                    alt={profile?.name || 'User Avatar'}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #0284c7',
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)'
                    }}
                    onError={(e) => { e.currentTarget.src = AVATAR_OPTIONS[0]; }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}>
                    <Camera size={14} />
                  </div>
                </div>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                  {profile?.name || authUser?.name || 'Khách hàng'}
                </h2>
                <div style={{ fontSize: '13px', color: '#64748b', wordBreak: 'break-all', marginBottom: '12px' }}>
                  {profile?.email || authUser?.email}
                </div>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: profile?.role === 'admin' ? '#fef3c7' : '#e0f2fe',
                  color: profile?.role === 'admin' ? '#b45309' : '#0369a1',
                  textTransform: 'uppercase'
                }}>
                  <Shield size={12} />
                  {profile?.role === 'admin' ? 'Quản Trị Viên' : 'Khách Hàng Thành Viên'}
                </span>
              </div>

              {/* Thông tin bổ sung */}
              <div style={{ padding: '20px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#64748b' }}>
                  <Calendar size={16} color="#94a3b8" />
                  <span>Ngày tham gia: <strong style={{ color: '#334155' }}>{formatDate(profile?.createdAt || profile?.timestamps?.createdAt)}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#64748b' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Trạng thái: <strong style={{ color: '#10b981' }}>Đang hoạt động</strong></span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('info')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: activeTab === 'info' ? 700 : 500,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: activeTab === 'info' ? '#f0f9ff' : 'transparent',
                    color: activeTab === 'info' ? '#0284c7' : '#475569',
                    textAlign: 'left'
                  }}
                >
                  <User size={18} />
                  Thông tin cá nhân
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('password')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: activeTab === 'password' ? 700 : 500,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: activeTab === 'password' ? '#f0f9ff' : 'transparent',
                    color: activeTab === 'password' ? '#0284c7' : '#475569',
                    textAlign: 'left'
                  }}
                >
                  <Lock size={18} />
                  Bảo mật & Đổi mật khẩu
                </button>
              </div>
            </div>

            {/* Cột phải: Form Chi Tiết */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0'
            }}>
              {activeTab === 'info' ? (
                /* TAB 1: THÔNG TIN CÁ NHÂN */
                <div>
                  <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                      Cập Nhật Thông Tin Cá Nhân
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                      Thay đổi họ tên hiển thị, số điện thoại liên lạc và ảnh đại diện của bạn.
                    </p>
                  </div>

                  <form onSubmit={handleUpdateProfile}>
                    {/* Chọn nhanh ảnh Avatar */}
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '10px' }}>
                        Chọn ảnh đại diện mẫu:
                      </label>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {AVATAR_OPTIONS.map((item, index) => (
                          <img
                            key={index}
                            src={item}
                            alt={`Avatar Option ${index + 1}`}
                            onClick={() => setAvatar(item)}
                            style={{
                              width: '52px',
                              height: '52px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              cursor: 'pointer',
                              border: avatar === item ? '3px solid #0284c7' : '2px solid transparent',
                              transform: avatar === item ? 'scale(1.08)' : 'scale(1)',
                              transition: 'all 0.15s ease'
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Họ và tên */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                        Họ và Tên <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ví dụ: Nguyễn Văn A"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 14px 12px 42px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            color: '#0f172a',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.2s'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#0284c7'}
                          onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                        />
                      </div>
                    </div>

                    {/* Email (Readonly) */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                        Địa chỉ Email <span style={{ fontSize: '12px', fontWeight: 400, color: '#94a3b8' }}>(Không thể thay đổi)</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="email"
                          value={profile?.email || ''}
                          disabled
                          style={{
                            width: '100%',
                            padding: '12px 14px 12px 42px',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#f1f5f9',
                            fontSize: '14px',
                            color: '#64748b',
                            cursor: 'not-allowed',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>

                    {/* Số điện thoại */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                        Số điện thoại liên lạc
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Ví dụ: 0987654321"
                          style={{
                            width: '100%',
                            padding: '12px 14px 12px 42px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            color: '#0f172a',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.2s'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#0284c7'}
                          onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                        />
                      </div>
                    </div>

                    {/* URL Avatar tùy chỉnh */}
                    <div style={{ marginBottom: '28px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                        Đường dẫn Ảnh đại diện (URL)
                      </label>
                      <input
                        type="url"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px',
                          color: '#0f172a',
                          outline: 'none',
                          boxSizing: 'border-box',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#0284c7'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                      />
                    </div>

                    {/* Nút lưu */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="submit"
                        disabled={updateLoading}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 28px',
                          borderRadius: '10px',
                          backgroundColor: '#0284c7',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: 600,
                          border: 'none',
                          cursor: updateLoading ? 'not-allowed' : 'pointer',
                          boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => { if (!updateLoading) e.currentTarget.style.backgroundColor = '#0369a1'; }}
                        onMouseLeave={(e) => { if (!updateLoading) e.currentTarget.style.backgroundColor = '#0284c7'; }}
                      >
                        {updateLoading ? (
                          <>
                            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Lưu thay đổi
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* TAB 2: ĐỔI MẬT KHẨU */
                <div>
                  <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                      Đổi Mật Khẩu
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                      Để bảo vệ tài khoản của bạn, vui lòng không chia sẻ mật khẩu cho bất kỳ ai.
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword}>
                    {/* Mật khẩu hiện tại */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                        Mật khẩu hiện tại <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Nhập mật khẩu bạn đang sử dụng"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 14px 12px 42px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            color: '#0f172a',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>

                    {/* Mật khẩu mới */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                        Mật khẩu mới <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <KeyRound size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Tối thiểu 6 ký tự"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 14px 12px 42px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            color: '#0f172a',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>

                    {/* Xác nhận mật khẩu mới */}
                    <div style={{ marginBottom: '28px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                        Xác nhận mật khẩu mới <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <KeyRound size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Nhập lại mật khẩu mới"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 14px 12px 42px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            color: '#0f172a',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>

                    {/* Nút cập nhật mật khẩu */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 28px',
                          borderRadius: '10px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: 600,
                          border: 'none',
                          cursor: passwordLoading ? 'not-allowed' : 'pointer',
                          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => { if (!passwordLoading) e.currentTarget.style.backgroundColor = '#1e293b'; }}
                        onMouseLeave={(e) => { if (!passwordLoading) e.currentTarget.style.backgroundColor = '#0f172a'; }}
                      >
                        {passwordLoading ? (
                          <>
                            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <Lock size={16} />
                            Đổi mật khẩu ngay
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
