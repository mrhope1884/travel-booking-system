const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/user.controller');

// Quản lý người dùng cho Quản trị viên (Thuần Action-based)
router.get('/all', userController.getAllUsers);
router.post('/create', userController.createUser);
router.get('/detail/:id', userController.getUserById);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

module.exports = router;
