# 1. Tải môi trường Node.js phiên bản 20 bản rút gọn (alpine) cho nhẹ
FROM node:20-alpine

# 2. Tạo thư mục làm việc bên trong container là /app
WORKDIR /app

# 3. Copy file package.json vào trước để chuẩn bị cài thư viện
COPY package*.json ./

# 4. Chạy lệnh cài đặt các thư viện (như express, cors...)
RUN npm install

# 5. Copy toàn bộ code còn lại từ thư mục server/ bên ngoài vào trong container
COPY . .

# 6. Báo cho Docker biết container này sẽ chạy ở cổng 5000 (cổng của Express)
EXPOSE 5000

# 7. Lệnh để khởi động server khi container chạy
CMD ["node", "src/index.js"]
