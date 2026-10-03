// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = {
    // 🔐 TRẠM GÁC 1: Xác thực JWT (Xem đã đăng nhập/đăng xuất chưa)
    verifyToken: (req, res, next) => {
        try {
            // Lấy token từ Header Authorization gửi lên
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1]; // Lấy chuỗi mã JWT sau chữ "Bearer"

            // TÌNH HUỐNG 1: Không mang theo vé (Chưa đăng nhập hoặc đã bấm đăng xuất)
            if (!token) {
                const error = new Error("Quyền truy cập bị từ chối! Vui lòng đăng nhập.");
                error.statusCode = 401; // 401 Unauthorized
                return next(error); // 📞 Đẩy lỗi về phễu error.middleware.js
            }

            // TÌNH HUỐNG 2: Có token -> Dùng chìa khóa giải mã để soát vé xịn/fake
            // Lấy mã bí mật từ file .env, nếu không có thì dùng chuỗi mặc định 'DEFAULT_SECRET_KEY'
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'DEFAULT_SECRET_KEY');

            // Vé xịn! Đính kèm thông tin user (id, role) vào req để các API sau sử dụng luôn
            req.user = decoded; 
            
            next(); // 🔓 Mở cửa cho đi tiếp vào các API phía dưới rào chắn

        } catch (err) {
            // Nếu jwt.verify thất bại (vé giả, mã bị sửa đổi, hoặc vé hết hạn)
            err.statusCode = 401;
            err.message = "Mã token không hợp lệ hoặc phiên đăng nhập của bạn đã hết hạn!";
            
            return next(err); // 📞 Đẩy lỗi về phễu error.middleware.js ở đáy hệ thống để xử lý
        }
    },

    // 👮 TRẠM GÁC 2: Phân quyền (Check xem tài khoản có phải là ADMIN không)
    checkAdmin: (req, res, next) => {
        // Trạm gác verifyToken chạy trước đã điền sẵn role vào req.user rồi!
        if (req.user && req.user.role === 'admin') {
            next(); // Đúng là Admin! Mở cửa cho vào các API VIP (Thêm/Sửa/Xóa Tour...)
        } else {
            const error = new Error("Tài khoản của bạn không có quyền thực hiện tính năng này!");
            error.statusCode = 403; // 403 Forbidden (Cấm truy cập)
            next(error); // Đẩy lỗi về phễu error.middleware.js
        }
    }
};

module.exports = authMiddleware;
