const express = require('express');
const router = express.Router();
const tourController = require('../../controllers/client/tour.controller');

// 1. Lấy danh sách tour nổi bật cho Trang chủ
router.get('/featured', tourController.getFeaturedTours);

// 2. Lấy danh sách toàn bộ tour (tìm kiếm, lọc giá, phân trang)
router.get('/', tourController.getAllTours);

// 3. Chi tiết 1 tour theo ID
router.get('/:id', tourController.getTourById);

module.exports = router;
