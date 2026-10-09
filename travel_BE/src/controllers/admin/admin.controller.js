const User = require('../../models/user.model');

// 1. Admin lấy danh sách người dùng 
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password").sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo giảm dần

    res.status(200).json({
      status: "success",
      message: "Lấy danh sách người dùng thành công!",
      data: users
    });
  } catch (error) {
    next(error);
  }
};
    

// 1b. Admin tạo mới người dùng hoặc quản trị viên
module.exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, status, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "❌ Email này đã được đăng ký!" });
    }

    const user = new User({
      name,
      email,
      password: password || '123456',
      role: 'user',
      status: status || 'active',
      phone: phone || ''
    });
    await user.save();

    res.status(201).json({
      status: "success",
      message: "🎉 Tạo người dùng mới thành công!",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone
      }
    });
  } catch (error) {
    next(error);
  }
};

// 2. Admin xem chi tiết một người dùng
module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: "user" }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "❌ Người dùng không tồn tại!" });
    }
    res.status(200).json({
      status: "success",
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// 3. Admin cập nhật thông tin người dùng (tên, role, status)
module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, role, status, phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, role, status, phone },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "❌ Người dùng không tồn tại!" });
    }

    res.status(200).json({
      status: "success",
      message: "🎉 Cập nhật người dùng thành công!",
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// 4. Admin xóa người dùng
module.exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "❌ Người dùng không tồn tại!" });
    }
    res.status(200).json({
      status: "success",
      message: "🎉 Xóa người dùng thành công!",
      data: null
    });
  } catch (error) {
    next(error);
  }
};
 
//5. Admin xem tất cả admin
module.exports.getAllAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      message: "Lấy danh sách admin thành công!",
      data: admins
    });
  } catch (error) {
    next(error);
  }
};

//6. Admin xem chi tiết một admin
module.exports.getAdminById = async (req, res, next) => {
  try {
    const admin = await User.findOne({ _id: req.params.id, role: "admin" }).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "❌ Admin không tồn tại!" });
    }
    res.status(200).json({
      status: "success",
      data: admin
    });
  } catch (error) {
    next(error);
  }
};

//7. Admin cập nhật thông tin admin (tên, role, status)
module.exports.updateAdmin = async (req, res, next) => {
  try {
    const { name, role, status, phone } = req.body;
    const updatedAdmin = await User.findByIdAndUpdate(
      req.params.id,
      { name, role, status, phone },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json({ message: "❌ Admin không tồn tại!" });
    }

    res.status(200).json({
      status: "success",
      message: "🎉 Cập nhật admin thành công!",
      data: updatedAdmin
    });
  } catch (error) {
    next(error);
  }
};
