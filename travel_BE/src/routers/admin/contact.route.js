const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/admin/contact.controller');

// Quản lý liên hệ cho Quản trị viên
router.get('/', contactController.getAllContacts);
router.patch('/:id', contactController.updateContactStatus);
router.delete('/:id', contactController.deleteContact);

module.exports = router;
