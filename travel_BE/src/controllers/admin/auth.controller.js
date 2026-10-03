const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');

// Đăng nhập dành riêng cho Quản trị viên (Admin)
module.exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "❌ Tài khoản quản trị không tồn tại!" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "⛔ Bạn không có thẩm quyền Quản trị viên (Admin)!" });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: "⛔ Tài khoản Admin này đã bị vô hiệu hóa!" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "❌ Mật khẩu không chính xác!" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'DEFAULT_SECRET_KEY',
      { expiresIn: "7d" }
    );

    res.status(200).json({
      status: "success",
      message: "🎉 Đăng nhập Admin thành công!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
