const expess = require('express');
const router = expess.Router();
const adminController = require('../../controllers/admin/admin.controller');

router.get('/', adminController.getAllAdmins);
router.get('/:id', adminController.getAdminById);
router.put('/:id', adminController.updateAdmin);

module.exports = router;