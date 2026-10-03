const express = require('express');
const router = express.Router();

const authRoute = require('./auth.route');
const tourRoute = require('./tour.route');
const bookingRoute = require('./booking.route');
const contactRoute = require('./contact.route');

// Định tuyến các tài nguyên của phân hệ khách hàng
router.use('/auth', authRoute);
router.use('/tours', tourRoute);
router.use('/bookings', bookingRoute);
router.use('/contacts', contactRoute);

module.exports = router;
