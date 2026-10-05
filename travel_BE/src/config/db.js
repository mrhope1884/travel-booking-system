const mongoose = require('mongoose');
const dns = require('dns');

// Fix lỗi querySrv ECONNREFUSED trên môi trường Windows Node.js khi kết nối MongoDB Atlas SRV
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn("Không thể gán custom DNS servers:", e.message);
}

module.exports.connect = async () => {
  try {
    // Thêm option serverSelectionTimeoutMS để Mongoose kiên nhẫn đợi kết nối hơn
    const databaseUrl = process.env.MONGODB_URL;

    await mongoose.connect(databaseUrl, {
      serverSelectionTimeoutMS: 30000 
    });
    console.log("✅ Kết nối Database thành công!");
  } catch (error) {
    console.log("❌ Lỗi kết nối Database:", error);
    process.exit(1); // 🔥 BẮT BUỘC: Dừng ứng dụng nếu DB lỗi, không cho chạy tiếp để tránh nghẽn
  }
};
