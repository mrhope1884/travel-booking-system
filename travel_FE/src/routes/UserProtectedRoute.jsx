import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UserProtectedRoute = ({ children }) => {
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <LoadingSpinner text="Đang xác thực tài khoản khách hàng..." />
      </div>
    );
  }

  // Cho phép cả Khách hàng và Admin (Admin cũng có thể xem và đặt tour)
  const token = authService.getUserToken() || authService.getAdminToken();

  if (!token) {
    const redirectParam = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectParam}`} replace />;
  }

  return children;
};

export default UserProtectedRoute;
