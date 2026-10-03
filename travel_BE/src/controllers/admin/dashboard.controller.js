const Tour = require('../../models/tour.model');
const Booking = require('../../models/booking.model');
const User = require('../../models/user.model');

// Tổng hợp số liệu thống kê Dashboard cho Admin
module.exports.getDashboardStats = async (req, res, next) => {
  try {
    const [tours, bookings, totalUsers] = await Promise.all([
      Tour.find({ isDeleted: false }),
      Booking.find().populate("tour").populate("user", "name email").sort({ createdAt: -1 }),
      User.countDocuments()
    ]);

    const activeTours = tours.length;
    const totalBookings = bookings.length;

    // Tổng doanh thu thực tế từ các đơn không bị hủy
    const totalRevenue = bookings.reduce((sum, b) => {
      if (b.status !== "cancelled") {
        return sum + (Number(b.price) || 0);
      }
      return sum;
    }, 0);

    // Phân loại điểm đến theo miền
    let mienBacCount = 0;
    let mienTrungCount = 0;
    let mienNamCount = 0;

    tours.forEach((t) => {
      const region = t.region || "Miền Bắc";
      if (region === "Miền Trung") {
        mienTrungCount++;
      } else if (region === "Miền Nam") {
        mienNamCount++;
      } else {
        mienBacCount++;
      }
    });

    const totalDest = mienBacCount + mienTrungCount + mienNamCount || 1;
    const destinationChart = [
      { name: "Miền Bắc", value: mienBacCount, percentage: Math.round((mienBacCount / totalDest) * 100), color: "#e74c3c" },
      { name: "Miền Trung", value: mienTrungCount, percentage: Math.round((mienTrungCount / totalDest) * 100), color: "#1abc9c" },
      { name: "Miền Nam", value: mienNamCount, percentage: Math.round((mienNamCount / totalDest) * 100), color: "#9b59b6" }
    ];

    // Tỷ lệ trạng thái đơn đặt tour
    const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
    const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;
    const totalStatus = confirmedCount + cancelledCount || 1;

    const paymentMethodChart = [
      { name: "Đã xác nhận", value: confirmedCount, percentage: Math.round((confirmedCount / totalStatus) * 100), color: "#10b981" },
      { name: "Đã hủy", value: cancelledCount, percentage: Math.round((cancelledCount / totalStatus) * 100), color: "#ef4444" }
    ];

    // Top 5 tours được đặt nhiều nhất
    const tourBookingCounts = new Map();
    bookings.forEach((b) => {
      const tId = b.tour?._id || b.tour;
      if (tId) {
        tourBookingCounts.set(String(tId), (tourBookingCounts.get(String(tId)) || 0) + (Number(b.numBookedSeats) || 1));
      }
    });

    const sortedTours = [...tours].sort((a, b) => {
      const bookedA = tourBookingCounts.get(String(a._id)) || 0;
      const bookedB = tourBookingCounts.get(String(b._id)) || 0;
      return bookedB - bookedA;
    });

    const topTours = sortedTours.slice(0, 5).map((t) => ({
      _id: t._id,
      id: t._id ? String(t._id).slice(-4).toUpperCase() : "TOUR",
      title: t.title,
      price: t.price,
      description: t.description,
      imageCover: t.imageCover || "default-tour.jpg",
      maxGroupSize: t.maxGroupSize,
      bookedSeats: tourBookingCounts.get(String(t._id)) || 0,
      availableSeats: t.maxGroupSize || 20,
      isDeleted: t.isDeleted || false,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    }));

    // 5 đơn đặt tour mới nhất
    const recentBookings = bookings.slice(0, 5).map((b) => ({
      _id: b._id,
      id: b._id ? String(b._id).slice(-4).toUpperCase() : "BOOK",
      tour: b.tour,
      user: b.user,
      customerName: b.user?.name || "Khách hàng",
      tourTitle: b.tour?.title || "Tour du lịch tham quan",
      price: b.price || 0,
      totalPrice: b.price || 0,
      numBookedSeats: b.numBookedSeats || 1,
      status: b.status || "confirmed",
      createdAt: b.createdAt,
      updatedAt: b.updatedAt
    }));

    res.status(200).json({
      status: "success",
      data: {
        stats: {
          activeTours,
          totalBookings,
          registeredUsers: totalUsers,
          totalRevenue
        },
        destinationChart,
        paymentMethodChart,
        topTours,
        recentBookings
      }
    });
  } catch (error) {
    next(error);
  }
};
