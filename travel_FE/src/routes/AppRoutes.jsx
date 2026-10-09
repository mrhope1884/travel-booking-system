import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Route Guards
import ProtectedRoute from './ProtectedRoute';
import UserProtectedRoute from './UserProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import UserLayout from '../layouts/UserLayout';

// Admin Pages
import AdminLogin from '../pages/admin/Login';
import Dashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import AdminTours from '../pages/admin/Tours';
import TrashTours from '../pages/admin/TrashTours';
import AdminBookings from '../pages/admin/Bookings';
import Admins from '../pages/admin/Admins';
import Contact from '../pages/admin/Contact';

// User Pages
import Home from '../pages/user/Home';
import UserLogin from '../pages/user/UserLogin';
import UserRegister from '../pages/user/UserRegister';
import TourList from '../pages/user/TourList';
import TourDetail from '../pages/user/TourDetail';
import Payment from '../pages/user/Payment';
import MyBookings from '../pages/user/MyBookings';
import BookingDetail from '../pages/user/BookingDetail';
import Profile from '../pages/user/Profile';
import UserContact from '../pages/user/Contact';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= USER PUBLIC & CLIENT ROUTES ================= */}
      <Route element={<UserLayout />}>
        {/* Trang chủ và Danh sách Tour */}
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<TourList />} />
        <Route path="/tours/:id" element={<TourDetail />} />
        <Route path="/contact" element={<UserContact />} />

        {/* User Protected Booking Routes */}
        <Route
          path="/bookings/payment/:bookingId"
          element={
            <UserProtectedRoute>
              <Payment />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <UserProtectedRoute>
              <MyBookings />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/bookings/:id"
          element={
            <UserProtectedRoute>
              <BookingDetail />
            </UserProtectedRoute>
          }
        />
        {/* User Profile Route */}
        <Route
          path="/profile"
          element={
            <UserProtectedRoute>
              <Profile />
            </UserProtectedRoute>
          }
        />
      </Route>

      {/* User Auth Pages */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />

      {/* ================= ADMIN MANAGEMENT ROUTES ================= */}
      {/* Public Route: Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes (Bắt buộc role: 'admin') */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="tours" element={<AdminTours />} />
        <Route path="tours/trash" element={<TrashTours />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="admins" element={<Admins />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/tours" replace />} />
    </Routes>
  );
};

export default AppRoutes;
