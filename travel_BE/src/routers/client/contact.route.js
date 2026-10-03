const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/client/contact.controller');

// Khách gửi thông tin liên hệ / tư vấn (Public)
router.post('/create', contactController.createContact);

module.exports = router;
