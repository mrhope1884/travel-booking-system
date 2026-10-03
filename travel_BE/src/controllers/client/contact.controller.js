const Contact = require('../../models/contact.model');

// Khách gửi thông tin liên hệ / yêu cầu tư vấn
module.exports.createContact = async (req, res, next) => {
  try {
    const { fullName, email, phone, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ họ tên, email và nội dung!" });
    }

    const newContact = await Contact.create({ fullName, email, phone, message });

    res.status(201).json({
      status: "success",
      message: "🎉 Cảm ơn bạn! Yêu cầu tư vấn đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất.",
      data: newContact
    });
  } catch (error) {
    next(error);
  }
};
