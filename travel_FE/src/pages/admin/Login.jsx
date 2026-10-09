import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isExpired = searchParams.get('expired') === '1';

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu!');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await adminLogin(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#222d32',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#1e282c',
            padding: '28px 24px',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#00c0ef',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              color: '#fff',
            }}
          >
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0, letterSpacing: '0.5px' }}>
            Travel Tour Admin
          </h2>
          <p style={{ fontSize: '13px', color: '#b8c7ce', marginTop: '6px' }}>
            Hệ thống Quản trị & Điều hành Tour Du lịch
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '28px 24px' }}>
          {isExpired && !error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fef3c7',
                color: '#b45309',
                padding: '12px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>⚠️ Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục quản trị!</span>
            </div>
          )}

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fee2e2',
                color: '#dc2626',
                padding: '12px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#444',
                marginBottom: '6px',
              }}
            >
              Email Quản trị
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                  display: 'flex',
                }}
              >
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="admin@travel.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  border: '1px solid #d2d6de',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#00c0ef')}
                onBlur={(e) => (e.target.style.borderColor = '#d2d6de')}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#444',
                marginBottom: '6px',
              }}
            >
              Mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                  display: 'flex',
                }}
              >
                <Lock size={16} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  border: '1px solid #d2d6de',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#00c0ef')}
                onBlur={(e) => (e.target.style.borderColor = '#d2d6de')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#00c0ef',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#00a7d0';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#00c0ef';
            }}
          >
            {loading && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
            <span>{loading ? 'Đang xác thực...' : 'Đăng nhập Quản trị'}</span>
           </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
