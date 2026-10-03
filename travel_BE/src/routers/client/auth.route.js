const express = require('express');
const router = express.Router();
const authController = require('../../controllers/client/auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Customer protected routes (Profile)
router.get('/profile', authMiddleware.verifyToken, authController.getProfile);
router.put('/profile', authMiddleware.verifyToken, authController.updateProfile);
router.put('/change-password', authMiddleware.verifyToken, authController.changePassword);

module.exports = router;
