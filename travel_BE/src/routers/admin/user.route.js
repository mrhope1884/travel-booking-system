const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/admin.controller');

// Quản lý người dùng cho Quản trị viên (Thuần Action-based)
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
