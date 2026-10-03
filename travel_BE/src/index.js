const express = require('express');
const cors = require('cors');
require('dotenv').config();

const database = require('./config/db');
const errorMiddleware = require('./middlewares/error.middleware');

// Nạp 2 phân hệ điều hướng độc lập
const clientRoutes = require('./routers/client/index.route');
const adminRoutes = require('./routers/admin/index.route');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// 🔴 CỔNG QUẢN TRỊ ADMIN (Prefix: /api/admin/...)
app.use('/api/admin', adminRoutes);

// 🟢 CỔNG KHÁCH HÀNG (Prefix: /api/...)
app.use('/api', clientRoutes);

// Bắt lỗi tập trung
app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('🚀 Travel Booking System API is running smoothly!');
});

async function start() {
  await database.connect();
  app.listen(port, () => {
    console.log(`🚀 Server Backend đang chạy tại: http://localhost:${port}`);
    console.log(`🟢 Cổng Khách hàng (User): http://localhost:${port}/api`);
    console.log(`🔴 Cổng Quản trị (Admin):   http://localhost:${port}/api/admin`);
  });
}

start();
