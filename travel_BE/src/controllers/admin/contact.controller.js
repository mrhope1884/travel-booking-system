const Contact = require('../../models/contact.model');

// 1. Admin xem danh sách liên hệ của khách hàng
module.exports.getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      results: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// 2. Admin cập nhật trạng thái liên hệ (pending -> resolved)
module.exports.updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "❌ Tin nhắn liên hệ không tồn tại!" });
    }

    res.status(200).json({
      status: "success",
      message: "🎉 Cập nhật trạng thái thành công!",
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// 3. Admin xóa tin nhắn liên hệ
module.exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "❌ Tin nhắn liên hệ không tồn tại!" });
    }
    res.status(200).json({
      status: "success",
      message: "🎉 Đã xóa tin nhắn liên hệ thành công!"
    });
  } catch (error) {
    next(error);
  }
};
