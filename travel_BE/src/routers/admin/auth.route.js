const express = require('express');
const router = express.Router();
const authController = require('../../controllers/admin/auth.controller');

// Đăng nhập Admin
router.post('/login', authController.adminLogin);

module.exports = router;
