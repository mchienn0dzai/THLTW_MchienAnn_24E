# HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH ĐỒ ÁN E-SHOP (LARAVEL & NEXT.JS)

Đồ án môn học: Thực hành Lập trình Web (229221)  
Hệ thống Thương mại Điện tử E-Shop tích hợp đầy đủ các tính năng người dùng, phân quyền quản trị (Admin), thanh toán trực tuyến (VietQR), quản lý mã khuyến mãi và gửi email tự động.

---

## 1. YÊU CẦU HỆ THỐNG TRƯỚC KHI CÀI ĐẶT
Để chạy được dự án trên một thiết bị mới, máy tính của bạn cần được cài đặt sẵn:
- **PHP** (phiên bản từ 8.1 trở lên) kèm Composer.
- **Node.js** (phiên bản từ 18.x trở lên) kèm npm.
- **MySQL** (hoặc XAMPP / Laragon).

---

## 2. CƠ SỞ DỮ LIỆU (DATABASE CONFIGURATION)
1. Mở phần mềm quản lý MySQL (phpMyAdmin, Navicat hoặc DBeaver).
2. Tạo một cơ sở dữ liệu (Database) mới hoàn toàn với tên: **`ltw3_mchienan`** (hoặc tên tùy ý của bạn).
3. Đảm bảo thông tin kết nối trong file `.env` của thư mục `backend` khớp với hệ thống của bạn:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=ltw3_mchienan
   DB_USERNAME=root
   DB_PASSWORD=
   ```

---

## 3. HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY ỨNG DỤNG (CHO THIẾT BỊ MỚI)

Sau khi clone/tải source code về máy mới, bạn mở **2 cửa sổ Terminal (hoặc Command Prompt)** chạy song song như sau:

### Cửa sổ 1: Chạy Backend (Laravel API)
Di chuyển vào thư mục `backend`:
```bash
cd backend
```
Cài đặt các gói thư viện PHP:
```bash
composer install
```
Copy file cấu hình môi trường (nếu chưa có):
```bash
cp .env.example .env
```
Tạo khóa ứng dụng (App Key):
```bash
php artisan key:generate
```
Chạy migration để khởi tạo các bảng trong cơ sở dữ liệu:
```bash
php artisan migrate
```
Khởi động máy chủ Laravel ở cổng `8000`:
```bash
php artisan serve
```
*(Server backend sẽ chạy tại địa chỉ: `http://127.0.0.1:8000`)*

---

### Cửa sổ 2: Chạy Frontend (Next.js UI)
Mở cửa sổ Terminal thứ 2, di chuyển vào thư mục `frontend`:
```bash
cd frontend
```
Cài đặt các gói thư viện Node.js:
```bash
npm install
```
Khởi động máy chủ Next.js ở cổng `3000`:
```bash
npm run dev
```
*(Giao diện website sẽ chạy tại địa chỉ: `http://localhost:3000`)*

---

## 4. THÔNG TIN TÀI KHOẢN ĐĂNG NHẬP (ACCOUNTS)

Hệ thống đã phân quyền sẵn 2 loại tài khoản để kiểm tra:

### 🛡️ Khu vực Quản trị (Admin)
- **Đường dẫn:** `http://localhost:3000/admin`
- **Email Admin:** `admin@shop.com` (hoặc tạo tài khoản mới rồi chỉnh sửa cột `role = 1` trong CSDL).
- **Mật khẩu:** `123456`

### 👤 Khách hàng / Thành viên (Customer)
- Bạn có thể bấm **Đăng ký** tài khoản mới trực tiếp tại trang web hoặc dùng tài khoản test:
- **Email:** `chien@example.com`
- **Mật khẩu:** `123456`

---

## 5. HƯỚNG DẪN SỬ DỤNG CÁC TÍNH NĂNG NỔI BẬT

### 💳 Thanh toán Online (VietQR)
1. Thêm sản phẩm vào giỏ hàng và tiến hành **Thanh toán**.
2. Ở phần **Phương thức thanh toán**, chọn **"Chuyển khoản (Mã QR)"**.
3. Hệ thống sẽ hiển thị mã VietQR động theo đúng tổng số tiền của đơn hàng. Bạn có thể dùng ứng dụng Ngân hàng bất kỳ để quét thử (tài khoản nhận mặc định cấu hình trên hệ thống demo).

### 🏷️ Áp dụng Mã Khuyến Mãi (Coupon)
1. Tại trang Thanh toán, ở ô nhập mã giảm giá, bạn nhập sẵn mã: **`SALE50K`**.
2. Bấm **Áp dụng**, hệ thống sẽ tự động trừ ngay 50.000 đ vào tổng hóa đơn.
3. Quản trị viên có thể vào trang quản lý mã khuyến mãi phía Admin để tạo thêm mã mới tùy ý.

### 📧 Gửi Email xác nhận đơn hàng tự động
- Hệ thống tích hợp thư viện **EmailJS** ở phía Frontend để gửi email trực tiếp tới hộp thư của khách hàng ngay sau khi đặt hàng thành công mà không cần cấu hình SMTP phức tạp trên PHP.

### 🔄 Hủy đơn hàng phía Người dùng
- Thành viên vào mục **Hồ sơ cá nhân (`/user/profile`)** -> Xem danh sách đơn hàng.
- Nếu đơn hàng đang ở trạng thái **"Chờ xác nhận"**, sẽ xuất hiện nút **"Hủy đơn"** cho phép khách hàng tự hủy trực tiếp.