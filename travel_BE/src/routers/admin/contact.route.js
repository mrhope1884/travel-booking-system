const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/admin/contact.controller');

// Quản lý liên hệ cho Quản trị viên
router.get('/all', contactController.getAllContacts);
router.patch('/update/:id', contactController.updateContactStatus);
router.delete('/delete/:id', contactController.deleteContact);

module.exports = router;
