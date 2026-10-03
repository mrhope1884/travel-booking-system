const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/client/booking.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Bắt buộc khách hàng phải đăng nhập mới được thao tác với booking
router.use(authMiddleware.verifyToken);

// 1. Đặt tour mới
router.post('/create', bookingController.createBooking);

// 2. Khách xem danh sách đơn của mình
router.get('/all', bookingController.getMyBookings);

// 3. Khách xem chi tiết 1 đơn
router.get('/detail/:id', bookingController.getBookingById);

// 4. Khách hủy đơn đặt tour
router.patch('/cancel/:id', bookingController.cancelBooking);

module.exports = router;
