import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Mail, Lock, LogIn, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy đường dẫn chuyển hướng sau khi đăng nhập thành công
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || '/tours';
  const isExpired = searchParams.get('expired') === '1';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ email và mật khẩu!');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(email.trim().toLowerCase(), password);
      // Chuyển hướng tới trang người dùng đang muốn truy cập
      navigate(redirectUrl, { replace: true });
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 140px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(2, 132, 199, 0.08), 0 4px 12px rgba(0,0,0,0.03)',
        border: '1px solid #e2e8f0',
        padding: '36px 32px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(2, 132, 199, 0.3)',
            marginBottom: '16px'
          }}>
            <Compass size={32} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
            Đăng Nhập Khách Hàng
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Khám phá và đặt tour du lịch tuyệt vời cùng Travel Việt
          </p>
        </div>

        {/* Expired Alert */}
        {isExpired && !error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: '8px',
            color: '#b45309',
            fontSize: '13px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>⚠️ Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục!</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            fontSize: '13px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Địa chỉ Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder="vidu: quan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  color: '#0f172a',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0284c7'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  color: '#0f172a',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0284c7'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '6px',
              padding: '13px',
              borderRadius: '10px',
              backgroundColor: loading ? '#93c5fd' : '#0284c7',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 700,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? (
              <span>Đang xác thực...</span>
            ) : (
              <>
                <LogIn size={18} />
                Đăng Nhập
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '10px' }}>
            Chưa có tài khoản?{' '}
            <Link to={`/auth/register?redirect=${encodeURIComponent(redirectUrl)}`} style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}>
              Đăng ký tài khoản mới <ArrowRight size={13} style={{ verticalAlign: 'middle' }} />
            </Link>
          </p>

          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Bạn là Quản trị viên?{' '}
            <Link to="/auth/admin/login" style={{ color: '#475569', fontWeight: 600, textDecoration: 'underline' }}>
              Đăng nhập Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
