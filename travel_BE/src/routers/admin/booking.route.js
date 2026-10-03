const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/admin/booking.controller');

// Quản lý đơn đặt tour cho Quản trị viên (Thuần Action-based)
router.get('/all', bookingController.getAllBookings);
router.patch('/payment/:id', bookingController.updatePaymentStatus);
router.patch('/cancel/:id', bookingController.cancelBooking);
router.delete('/delete/:id', bookingController.deleteBooking);

module.exports = router;
