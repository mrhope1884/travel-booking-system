const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');

const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const adminRoute = require('./admin.route');
const contactRoute = require('./contact.route');
const dashboardRoute = require('./dashboard.route');
const tourRoute = require('./tour.route');
const bookingRoute = require('./booking.route');

// 1. Cổng đăng nhập quản trị viên (Public) -> /api/admin/auth/login
router.use('/auth', authRoute);

// 2. TẤT CẢ CÁC TÀI NGUYÊN QUẢN TRỊ BÊN DƯỚI BẮT BUỘC PHẢI CÓ TOKEN ADMIN
router.use(authMiddleware.verifyToken, authMiddleware.checkAdmin);

router.use('/dashboard', dashboardRoute);
router.use('/tours', tourRoute);
router.use('/bookings', bookingRoute);
router.use('/users', userRoute);
router.use('/admins', adminRoute);
router.use('/contacts', contactRoute);

module.exports = router;
