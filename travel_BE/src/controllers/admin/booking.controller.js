const Booking = require("../../models/booking.model");

// 1. Admin lấy tất cả booking của toàn bộ khách hàng
module.exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("tour")
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Admin cập nhật trạng thái thanh toán (pending / paid / failed)
module.exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentMethod } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res
        .status(404)
        .json({ message: "❌ Đơn đặt tour không tồn tại!" });
    }
    if (booking.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "⚠️ Đơn đã hủy, không thể cập nhật thanh toán!" });
    }

    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (paymentMethod) booking.paymentMethod = paymentMethod;

    await booking.save();

    res.status(200).json({
      status: "success",
      message: "🎉 Cập nhật trạng thái thanh toán thành công!",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Admin hủy đơn đặt tour của khách (tự động hoàn trả số ghế cho tour)
module.exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
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
      const Tour = require("../../models/tour.model");
      await Tour.findByIdAndUpdate(booking.tour, {
        $inc: { maxGroupSize: seatsToRefund },
      });
    }

    res.status(200).json({
      status: "success",
      message: `🎉 Đã hủy đơn đặt tour và hoàn lại ${seatsToRefund} chỗ ngồi thành công!`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Admin xóa hẳn đơn đặt tour khỏi hệ thống
module.exports.deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res
        .status(404)
        .json({ message: "❌ Đơn đặt tour không tồn tại!" });
    }

    // Nếu xóa đơn đang confirmed thì hoàn lại ghế
    if (booking.status !== "cancelled" && booking.tour) {
      const Tour = require("../../models/tour.model");
      await Tour.findByIdAndUpdate(booking.tour, {
        $inc: { maxGroupSize: Number(booking.numBookedSeats || 1) },
      });
    }

    res.status(200).json({
      status: "success",
      message: "🎉 Đã xóa đơn đặt tour khỏi hệ thống thành công!",
    });
  } catch (error) {
    next(error);
  }
};
