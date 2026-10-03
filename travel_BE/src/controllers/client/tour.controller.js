const Tour = require('../../models/tour.model');

// 1. Lấy danh sách tour nổi bật cho Trang chủ
module.exports.getFeaturedTours = async (req, res, next) => {
  try {
    let tours = await Tour.find({ isDeleted: false, isFeatured: true }).limit(6);
    if (!tours || tours.length === 0) {
      tours = await Tour.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(6);
    }
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: tours
    });
  } catch (error) {
    next(error);
  }
};

// 2. Lấy danh sách tour (Khách tìm kiếm, lọc giá, phân trang)
module.exports.getAllTours = async (req, res, next) => {
  try {
    const { query, page, limit, minPrice, maxPrice, region } = req.query;    
    let filter = {
      isDeleted: false
    };

    const conditions = [];

    // Điều kiện còn chỗ trống
    conditions.push({ 
      $or: [
        { maxGroupSize: { $gt: 0 } },
        { maxGroupSize: { $exists: false } },
        { maxGroupSize: null }
      ]
    });

    if (query) {
      conditions.push({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } }
        ]
      });
    }

    if (conditions.length > 0) {
      filter.$and = conditions;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (region && region !== 'ALL') {
      filter.region = region;
    }

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 9;
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Tour.countDocuments(filter);
    const tours = await Tour.find(filter).skip(skip).limit(limitNumber);

    res.status(200).json({
      status: "success",
      total,
      totalPages: Math.ceil(total / limitNumber),
      currentPage: pageNumber,
      results: tours.length,
      data: tours
    });
  } catch (error) {
    next(error);
  }
};

// 3. Lấy chi tiết 1 tour theo ID
module.exports.getTourById = async (req, res, next) => {
  try {
    const tour = await Tour.findOne({ _id: req.params.id, isDeleted: false });
    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "❌ Tour không tồn tại hoặc đã bị xóa!"
      });
    }
    res.status(200).json({
      status: "success",
      data: tour
    });
  } catch (error) {
    next(error);
  }
};
