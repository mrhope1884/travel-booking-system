const express = require('express');
const router = express.Router();
const tourController = require('../../controllers/admin/tour.controller');

// Quản lý thùng rác
router.get('/trash', tourController.getTrashTours);
router.patch('/trash/:id', tourController.restoreTour);
router.delete('/trash/:id', tourController.destroyTour);

// Quản lý Tour cho Quản trị viên
router.get('/', tourController.getAdminTours);
router.post('/', tourController.createTour);
router.get('/:id', tourController.getTourById);
router.put('/:id', tourController.updateTour);
router.delete('/:id', tourController.deleteTour);

module.exports = router;
