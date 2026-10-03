const express = require('express');
const router = express.Router();
const tourController = require('../../controllers/admin/tour.controller');

// Quản lý Tour cho Quản trị viên
router.get('/all', tourController.getAdminTours);
router.post('/create', tourController.createTour);
router.get('/detail/:id', tourController.getTourById);
router.put('/update/:id', tourController.updateTour);
router.delete('/delete/:id', tourController.deleteTour);

// Quản lý thùng rác
router.get('/trash', tourController.getTrashTours);
router.patch('/restore/:id', tourController.restoreTour);
router.delete('/destroy/:id', tourController.destroyTour);

module.exports = router;
