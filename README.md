# 🌍 Travel Booking & Tour Management System

Hệ thống website đặt tour du lịch và cổng quản trị (Admin Dashboard) toàn diện, được xây dựng theo mô hình Fullstack (Node.js, Express, MongoDB, React, Docker).

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

* **Frontend:** React 19, Vite, React Router DOM (v7), Context API, Axios, Lucide React.
* **Backend:** Node.js, Express.js (Mô hình MVC, Custom Middlewares, Centralized Error Handling).
* **Database:** MongoDB, Mongoose ODM (Data Population, Soft Delete, Atomic Updates `$inc`).
* **Authentication & Security:** JWT (JSON Web Tokens), Bcrypt password hashing, RBAC (Role-Based Access Control).
* **DevOps:** Docker, Docker Compose (Multi-container Bridge Network).

---

## ✨ Tính Năng Nổi Bật

### 🟢 1. Phân hệ Khách hàng (Client Portal)
* **Khám phá & Tìm kiếm:** Lọc tour đa điều kiện (tìm kiếm từ khóa Regex, khoảng giá, khu vực miền Bắc/Trung/Nam) kèm phân trang.
* **Chi tiết & Đặt tour:** Xem thông tin lịch trình, số chỗ còn trống, tự động tính tổng tiền theo số lượng khách.
* **Nghiệp vụ Đặt tour & Hoàn trả ghế:** Tự động trừ số ghế khả dụng; khi khách **Hủy đơn**, hệ thống tự động hoàn lại số ghế cho tour bằng toán tử `$inc`.
* **Thanh toán chuyển khoản thông minh:** Tự sinh cú pháp thanh toán gắn mã đơn đặt chỗ chuẩn VietQR (`DATTOUR <Mã_Đơn>`).
* **Quản lý đơn hàng:** Theo dõi lịch sử đặt tour, trạng thái đơn và thông tin cá nhân.

### 🔴 2. Phân hệ Quản trị (Admin Portal)
* **Dashboard Thống kê:** Xử lý truy vấn song song `Promise.all` hiển thị tổng doanh thu, số lượng đơn, biểu đồ phân bổ tour và xếp hạng Top 5 tour được đặt nhiều nhất.
* **Quản lý Tour:** Thêm, sửa, xóa với cơ chế **Xóa mềm (Soft Delete)** và Thùng rác (Trash) cho phép khôi phục (Restore) hoặc xóa vĩnh viễn.
* **Quản lý Đơn đặt tour (Bookings):** Theo dõi danh sách đơn, duyệt hoặc hủy đơn của khách.
* **Quản lý Tài khoản (Users) & Liên hệ (Contacts):** Quản lý quyền tài khoản, trạng thái khóa/mở và phản hồi liên hệ từ khách hàng.

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy

### Khởi chạy nhanh bằng Docker Compose (Khuyên dùng)
Yêu cầu máy đã cài Docker Desktop:
```bash
# Khởi động toàn bộ hệ thống (Frontend & Backend)
docker-compose up --build
