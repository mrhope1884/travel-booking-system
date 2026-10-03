// File này tên là errorHandler.js - Dùng chung cho MỌI dự án Node.js Express
const errorHandler = (err, req, res, next) => {
    // 1. Lấy mã lỗi và lời nhắn (Nếu không có thì mặc định là lỗi hệ thống 500)
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Lỗi hệ thống nội bộ!';

    // 2. Gom các lỗi phổ biến của Database MongoDB (nếu dự án đó có dùng)
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Dữ liệu này đã tồn tại trong hệ thống!';
    }
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Định dạng ID gửi lên không hợp lệ!';
    }
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // 3. In lỗi ra màn hình Terminal của bạn (để bạn sửa code khi đang lập trình)
    console.error(`[ERROR LOG] ->`, err);

    // 4. Trả phản hồi chuẩn về cho trình duyệt/giao diện
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
        // Chỉ hiện chi tiết dòng code lỗi khi đang code (development), ẩn đi khi chạy thật (production)
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;
