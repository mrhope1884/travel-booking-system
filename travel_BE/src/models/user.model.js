const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Tạo khuôn mẫu (Schema) cho Người dùng
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: [true, "Vui lòng nhập email"], // Bắt buộc phải có email
        unique: true, // EMAIL KHÔNG ĐƯỢC TRÙNG NHAU (Rất quan trọng)
        lowercase: true // Tự động chuyển email về chữ thường để tránh lỗi
    },
    password: {
        type: String,
        required: [true, "Vui lòng nhập mật khẩu"],
        minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"]
    },
    role: {
        type: String,
        enum: ['user', 'staff', 'admin'],
        default: 'user'
    },
    phone: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: "default-avatar.png"
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    timestamps: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }
});

// Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        ;
    } catch (error) {
        throw error;
    }
});

// Phương thức để so sánh mật khẩu
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema, "users");

