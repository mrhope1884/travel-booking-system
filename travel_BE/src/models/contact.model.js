const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Vui lòng nhập họ tên!"]
    },
    email: {
        type: String,
        required: [true, "Vui lòng nhập email!"]
    },
    phone: {
        type: String,
        default: ""
    },
    message: {
        type: String,
        required: [true, "Vui lòng nhập nội dung tin nhắn!"]
    },
    status: {
        type: String,
        enum: ['pending', 'resolved'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Contact", contactSchema, "contacts");
