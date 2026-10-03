const Tour = require('../../models/tour.model');

// 1. Admin lấy danh sách toàn bộ tour để quản lý
module.exports.getAdminTours = async (req, res, next) => {
  try {
    const tours = await Tour.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: tours
    });
  } catch (error) {
    next(error);
  }
};

// 1b. Admin lấy chi tiết 1 tour theo ID
module.exports.getTourById = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: "❌ Tour không tồn tại!" });
    }
    res.status(200).json({
      status: "success",
      data: tour
    });
  } catch (error) {
    next(error);
  }
};

// 2. Admin tạo tour mới
module.exports.createTour = async (req, res, next) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      message: "🎉 Tạo tour du lịch mới thành công!",
      data: newTour
    });
  } catch (error) {
    next(error);
  }
};

// 3. Admin cập nhật tour
module.exports.updateTour = async (req, res, next) => {
  try {
    const tourId = req.params.id;
    const updatedTour = await Tour.findByIdAndUpdate(tourId, req.body, { new: true, runValidators: true });

    if (!updatedTour) {
      return res.status(404).json({ message: "❌ Tour không tồn tại!" });
    }

    res.status(200).json({
      status: "success",
      message: "🎉 Cập nhật thông tin tour thành công!",
      data: updatedTour
    });
  } catch (error) {
    next(error);
  }
};

// 4. Admin chuyển tour vào thùng rác (xóa mềm)
module.exports.deleteTour = async (req, res, next) => {
  try {
    const tourId = req.params.id;
    const deletedTour = await Tour.findByIdAndUpdate(
      tourId, 
      { isDeleted: true, deletedAt: new Date() }, 
      { new: true }
    );

    if (!deletedTour) {
      return res.status(404).json({ message: "❌ Tour không tồn tại!" });
    }

    res.status(200).json({
      status: "success",
      message: "🎉 Đã chuyển tour vào thùng rác!",
      data: deletedTour
    });
  } catch (error) {
    next(error);
  }
};

// 5. Admin xem danh sách tour trong thùng rác
module.exports.getTrashTours = async (req, res, next) => {
  try {
    const trashTours = await Tour.find({ isDeleted: true }).sort({ deletedAt: -1 });
    res.status(200).json({
      status: "success",
      results: trashTours.length,
      data: trashTours
    });
  } catch (error) {
    next(error);
  }
};

// 6. Admin khôi phục tour từ thùng rác
module.exports.restoreTour = async (req, res, next) => {
  try {
    const tourId = req.params.id;
    const restoredTour = await Tour.findByIdAndUpdate(
      tourId,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!restoredTour) {
      return res.status(404).json({ message: "❌ Tour không tồn tại trong thùng rác!" });
    }

    res.status(200).json({
      status: "success",
      message: "🎉 Khôi phục tour thành công!",
      data: restoredTour
    });
  } catch (error) {
    next(error);
  }
};

// 7. Admin xóa vĩnh viễn tour khỏi Database
module.exports.destroyTour = async (req, res, next) => {
  try {
    const tourId = req.params.id;
    const destroyedTour = await Tour.findByIdAndDelete(tourId);

    if (!destroyedTour) {
      return res.status(404).json({ message: "❌ Tour không tồn tại!" });
    }

    res.status(200).json({
      status: "success",
      message: "🎉 Đã xóa vĩnh viễn tour khỏi hệ thống!",
      data: null
    });
  } catch (error) {
    next(error);
  }
};
