import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, User, Mail, Lock, UserPlus, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

const UserRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || '/tours';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ tất cả thông tin!');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Xác nhận mật khẩu không trùng khớp!');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Gọi API đăng ký tài khoản
      await authService.register(name.trim(), email.trim().toLowerCase(), password);

      // Tự động đăng nhập luôn sau khi đăng ký thành công
      await login(email.trim().toLowerCase(), password);

      navigate(redirectUrl, { replace: true });
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Đăng ký thất bại. Email có thể đã được sử dụng!');
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
        maxWidth: '460px',
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
            Tạo Tài Khoản Mới
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Đăng ký để quản lý đơn đặt và nhận ưu đãi độc quyền
          </p>
        </div>

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

        {/* Register Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Họ và tên của bạn
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  color: '#0f172a',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Địa chỉ Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  color: '#0f172a',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Mật khẩu (tối thiểu 6 ký tự)
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  color: '#0f172a',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Xác nhận lại mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  color: '#0f172a',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
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
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
            }}
          >
            {loading ? (
              <span>Đang tạo tài khoản...</span>
            ) : (
              <>
                <UserPlus size={18} />
                Đăng Ký Ngay
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Đã có tài khoản?{' '}
            <Link to={`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`} style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}>
              Đăng nhập tại đây <ArrowRight size={13} style={{ verticalAlign: 'middle' }} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
