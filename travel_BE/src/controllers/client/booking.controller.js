const Booking = require("../../models/booking.model");
const Tour = require("../../models/tour.model");

// 1. Khách đặt tour
module.exports.createBooking = async (req, res, next) => {
  try {
    const { tourId, numBookedSeats, paymentMethod, phone } = req.body;

    // Kiểm tra tour tồn tại và chưa bị xóa mềm
    const seatsToBook = parseInt(numBookedSeats) || 1;
    if (seatsToBook <= 0) {
      return res
        .status(400)
        .json({ message: "❌ Số lượng ghế đặt phải lớn hơn 0!" });
    }
    if (!phone || phone.trim() === "") {
      return res
        .status(400)
        .json({ message: "❌ Vui lòng cung cấp số điện thoại liên hệ!" });
    }

    const tour = await Tour.findOneAndUpdate(
      { _id: tourId, isDeleted: false, maxGroupSize: { $gte: seatsToBook } },
      { $inc: { maxGroupSize: -seatsToBook } },
      { returnDocument: "after" },
    );
    if (!tour) {
      const existingTour = await Tour.findOne({
        _id: tourId,
        isDeleted: false,
      });
      if (!existingTour) {
        return res
          .status(404)
          .json({ message: "❌ Tour không tồn tại hoặc đã ngừng hoạt động!" });
      }
      return res
        .status(400)
        .json({
          message: `❌ Tour chỉ còn ${existingTour.maxGroupSize} chỗ ngồi! không đủ cho ${seatsToBook} ghế.`,
        });
    }
    
    const finalUserId = req.user.id;
    const phoneNumber = phone;
    const price = tour.price * seatsToBook;

    let newBooking;
    try {
      newBooking = await Booking.create({
        tour: tourId,
        user: finalUserId,
        phone: phoneNumber,
        price,
        numBookedSeats: seatsToBook,
        paymentMethod: paymentMethod || "vietqr",
      });
    } catch (error) {
      await Tour.findByIdAndUpdate(tourId, {
        $inc: { maxGroupSize: seatsToBook },
      });
      throw error;
    }
    res.status(201).json({
      status: "success",
      message: "🎉 Đặt tour thành công!",
      data: newBooking,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Khách xem danh sách đơn của chính mình
module.exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("tour")
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      message: "🎉 Lấy danh sách booking thành công!",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Khách xem chi tiết 1 đơn của chính mình
module.exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    })
      .populate("tour")
      .populate("user", "name email");

    if (!booking) {
      return res
        .status(404)
        .json({
          message: "❌ Đơn đặt tour không tồn tại hoặc bạn không có quyền xem!",
        });
    }

    res.status(200).json({
      status: "success",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Khách hủy đơn của chính mình (tự động hoàn lại số ghế cho tour)
module.exports.cancelBooking = async (req, res, next) => {
  try {
    // Nếu là admin thì được hủy bất kỳ đơn nào, khách chỉ được hủy đơn của mình
    const filter =
      req.user?.role === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, user: req.user.id };
    const booking = await Booking.findOne(filter);
    if (!booking) {
      return res
        .status(404)
        .json({ message: "❌ Đơn đặt tour không tồn tại!" });
    }

    if (booking.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "⚠️ Đơn đặt tour này đã bị hủy trước đó rồi!" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Tự động hoàn lại số ghế cho tour
    const seatsToRefund = Number(booking.numBookedSeats || 1);
    if (booking.tour) {
      await Tour.findByIdAndUpdate(booking.tour, {
        $inc: { maxGroupSize: seatsToRefund },
      });
    }

    res.status(200).json({
      status: "success",
      message: `🎉 Hủy đơn thành công và đã hoàn lại ${seatsToRefund} chỗ ngồi!`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// 5. Khách hàng cập nhật phương thức thanh toán cho đơn của mình
module.exports.updatePaymentMethod = async (req, res, next) => {
  try {
    const { paymentMethod } = req.body;
    const validMethods = ["vietqr", "momo", "paypal", "office"];

    if (!paymentMethod || !validMethods.includes(paymentMethod)) {
      return res
        .status(400)
        .json({ message: "❌ Phương thức thanh toán không hợp lệ!" });
    }

    // Chỉ tìm đơn thuộc về chính khách hàng đang đăng nhập
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!booking) {
      return res
        .status(404)
        .json({
          message:
            "❌ Đơn đặt tour không tồn tại hoặc bạn không có quyền cập nhật!",
        });
    }

    if (booking.status === "cancelled") {
      return res
        .status(400)
        .json({
          message: "⚠️ Đơn đã bị hủy, không thể đổi phương thức thanh toán!",
        });
    }

    if (booking.paymentStatus === "paid") {
      return res
        .status(400)
        .json({
          message:
            "⚠️ Đơn đã thanh toán thành công, không thể đổi phương thức!",
        });
    }

    // Cập nhật phương thức mới vào database
    booking.paymentMethod = paymentMethod;
    await booking.save();

    res.status(200).json({
      status: "success",
      message: "🎉 Cập nhật phương thức thanh toán thành công!",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
