const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');

// Đăng ký tài khoản khách hàng
module.exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await User.create({ name, email, password });

    res.status(201).json({
      status: "success",
      message: "🎉 Đăng ký tài khoản thành công!",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Đăng nhập khách hàng
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "❌ Người dùng không tồn tại!" });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: "⛔ Tài khoản của bạn đã bị khóa! Vui lòng liên hệ hỗ trợ." });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "❌ Mật khẩu không đúng!" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'DEFAULT_SECRET_KEY',
      { expiresIn: "7d" }
    );

    res.status(200).json({
      status: "success",
      message: "🎉 Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        avatar: user.avatar || 'default-avatar.png',
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Xem thông tin hồ sơ của chính mình
module.exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "❌ Không tìm thấy thông tin tài khoản!" });
    }
    res.status(200).json({
      status: "success",
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật thông tin cá nhân (Tên, SĐT, Avatar)
module.exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, avatar },
      { returnDocument: 'after', runValidators: true } 
    ).select("-password");

    res.status(200).json({
      status: "success",
      message: "🎉 Cập nhật hồ sơ thành công!",
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// Đổi mật khẩu
module.exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ mật khẩu cũ và mới!" });
    }

    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Mật khẩu hiện tại không chính xác!" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "🎉 Đổi mật khẩu thành công!"
    });
  } catch (error) {
    next(error);
  }
};
