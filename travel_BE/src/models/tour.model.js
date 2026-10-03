const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Tour phải có tên tiêu đề!"],
        trim: true,
        unique: true // Tên tour không được trùng nhau
    },
    price: {
        type: Number,
        required: [true, "Tour phải có giá tiền!"],
        min: [0, "Giá tiền phải lớn hơn hoặc bằng 0!"]
    },
    description: {
        type: String,
        required: [true, "Tour phải có mô tả lịch trình!"]
    },
    imageCover: {
        type: String,
        default: "default-tour.jpg" // Tạm thời để string, lát nữa cấu hình multer/cloudinary sẽ đổi sau
    },
    maxGroupSize: {
        type: Number,
        required: [true, "Tour phải có số lượng khách tối đa!"],
        min: [0, "Số lượng khách không thể âm!"] // Cho phép giảm về 0 khi hết chỗ
    },
    region: {
            type: String,
            enum: ['Miền Bắc', 'Miền Trung', 'Miền Nam'],
            default: 'Miền Bắc'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt 
});

module.exports = mongoose.model("Tour", tourSchema, "tours");
