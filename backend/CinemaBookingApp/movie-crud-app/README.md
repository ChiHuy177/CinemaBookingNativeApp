# 🎬 Movie CRUD Application (TypeScript + Authentication)

Ứng dụng React + TypeScript hoàn chỉnh để quản lý phim (CRUD) với hệ thống đăng nhập/đăng ký và giao diện hiện đại.

## ✨ Tính năng

### 🔐 Authentication
- ✅ **Đăng nhập** - Xác thực người dùng với email và mật khẩu
- ✅ **Đăng ký** - Tạo tài khoản mới với thông tin đầy đủ
- ✅ **Đăng xuất** - Xóa session và token
- ✅ **Bảo vệ routes** - Chỉ cho phép truy cập khi đã đăng nhập
- ✅ **Token Management** - Tự động lưu và sử dụng JWT token

### 🎬 Movie Management
- ✅ **Xem danh sách phim** - Hiển thị tất cả phim với giao diện card đẹp mắt
- ➕ **Thêm phim mới** - Form đầy đủ với validation
- ✏️ **Chỉnh sửa phim** - Cập nhật thông tin phim
- 🗑️ **Xóa phim** - Xóa phim với xác nhận
- 🔍 **Tìm kiếm phim** - Tìm kiếm theo tên hoặc đạo diễn
- 👁️ **Xem chi tiết** - Modal hiển thị thông tin đầy đủ của phim

### 🎨 Design Features
- **Dark Theme** - Giao diện tối hiện đại với gradient đẹp mắt
- **Glassmorphism** - Hiệu ứng kính mờ cho các thành phần
- **Smooth Animations** - Các hiệu ứng chuyển động mượt mà
- **Responsive** - Tương thích với mọi kích thước màn hình
- **Modern UI/UX** - Thiết kế theo xu hướng 2024
- **Type Safety** - TypeScript đảm bảo type safety cho toàn bộ ứng dụng

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình API

Cập nhật URL API trong các file service:

**`src/services/authService.ts`:**
```typescript
const API_BASE_URL = 'http://localhost:5000/api/auth';
```

**`src/services/movieService.ts`:**
```typescript
const API_BASE_URL = 'http://localhost:5000/api/movie';
```

### 3. Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:5173/**

## 📡 API Endpoints

### Authentication Endpoints
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `GET /api/auth/confirm-email` - Xác nhận email
- `POST /api/auth/sendResetPasswordCode` - Gửi mã reset password
- `POST /api/auth/resetPassword` - Reset password

### Movie CRUD Endpoints
- `GET /api/movie` - Lấy tất cả phim (Requires Auth)
- `GET /api/movie/{id}` - Lấy phim theo ID (Requires Auth)
- `GET /api/movie/detail/{id}` - Lấy chi tiết phim (Requires Auth)
- `POST /api/movie` - Tạo phim mới (Requires Auth)
- `PUT /api/movie/{id}` - Cập nhật phim (Requires Auth + Admin)
- `DELETE /api/movie/{id}` - Xóa phim (Requires Auth + Admin)
- `GET /api/movie/search?value={searchTerm}` - Tìm kiếm phim (Requires Auth)

## 📝 TypeScript Types

### Authentication Types

```typescript
interface LoginRequestDTO {
  email: string;
  password: string;
}

interface LoginResponseDTO {
  token: string;
  authenticated: boolean;
  email: string;
}

interface RegisterRequestDTO {
  name: string;
  phoneNumber: string;
  email: string;
  doB: string;
  city: string;
  address: string;
  genre: boolean; // true = Nam, false = Nữ
  password: string;
  confirmPassword: string;
}
```

### Movie Types

Xem chi tiết trong `src/types/movie.types.ts`

## 🛠️ Công nghệ sử dụng

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Vanilla CSS** - Styling (không dùng framework CSS)
- **Google Fonts (Inter)** - Typography
- **Fetch API** - HTTP requests
- **JWT** - JSON Web Token authentication
- **LocalStorage** - Token persistence

## 📂 Cấu trúc thư mục

```
src/
├── components/
│   ├── Login.tsx           # Component đăng nhập
│   ├── Login.css
│   ├── Register.tsx        # Component đăng ký
│   ├── Register.css
│   ├── MovieCard.tsx       # Component card hiển thị phim
│   ├── MovieCard.css
│   ├── MovieForm.tsx       # Form tạo/sửa phim
│   ├── MovieForm.css
│   ├── MovieList.tsx       # Component chính quản lý danh sách
│   └── MovieList.css
├── services/
│   ├── authService.ts      # Authentication service
│   └── movieService.ts     # Movie API service
├── types/
│   ├── auth.types.ts       # Auth type definitions
│   └── movie.types.ts      # Movie type definitions
├── App.tsx                 # Main app với routing logic
├── App.css
├── index.css
└── main.tsx
```

## 🎯 Hướng dẫn sử dụng

### Đăng ký tài khoản mới

1. Mở ứng dụng, bạn sẽ thấy màn hình đăng nhập
2. Click "Đăng ký ngay"
3. Điền đầy đủ thông tin:
   - Họ và tên
   - Số điện thoại (10 số)
   - Email
   - Ngày sinh (phải từ 13 tuổi trở lên)
   - Giới tính
   - Thành phố
   - Địa chỉ
   - Mật khẩu (ít nhất 6 ký tự)
   - Xác nhận mật khẩu
4. Click "Đăng ký"
5. Kiểm tra email để xác nhận tài khoản (nếu backend yêu cầu)

### Đăng nhập

1. Nhập email và mật khẩu
2. Click "Đăng nhập"
3. Token sẽ được lưu tự động vào localStorage
4. Bạn sẽ được chuyển đến trang quản lý phim

### Quản lý phim

Sau khi đăng nhập, bạn có thể:

- **Xem danh sách phim** - Tự động hiển thị
- **Tìm kiếm** - Nhập tên phim hoặc đạo diễn
- **Thêm phim** - Click "➕ Thêm phim mới"
- **Chỉnh sửa** - Hover vào card và click ✏️
- **Xóa** - Hover vào card và click 🗑️
- **Xem chi tiết** - Hover vào card và click 👁️

### Đăng xuất

Click nút "🚪 Đăng xuất" ở góc trên bên phải

## 🔒 Authentication Flow

1. **User đăng nhập** → Backend trả về JWT token
2. **Token được lưu** → localStorage.setItem('authToken', token)
3. **Mọi request sau đó** → Tự động gửi kèm token trong header
4. **Token hết hạn** → User cần đăng nhập lại
5. **Đăng xuất** → Xóa token khỏi localStorage

## ⚠️ Lưu ý

1. **Backend phải chạy trước** - Đảm bảo API backend đang hoạt động
2. **CORS** - Backend cần cấu hình CORS cho phép frontend truy cập
3. **Email Confirmation** - Một số tài khoản có thể cần xác nhận email
4. **Admin Role** - Một số chức năng (Update, Delete movie) yêu cầu role ADMIN
5. **Token Expiration** - Token có thể hết hạn, cần đăng nhập lại
6. **TypeScript** - Đảm bảo tuân thủ các types đã định nghĩa

## 🔧 Troubleshooting

### Lỗi đăng nhập
- Kiểm tra email và mật khẩu
- Đảm bảo tài khoản đã được xác nhận (nếu cần)
- Kiểm tra backend có đang chạy không

### Lỗi "Failed to fetch movies"
- Kiểm tra token còn hạn không
- Kiểm tra URL API trong `movieService.ts`
- Kiểm tra CORS settings

### Lỗi 401 Unauthorized
- Token đã hết hạn, đăng nhập lại
- Token không hợp lệ
- Kiểm tra localStorage có token không

### Lỗi 403 Forbidden (khi Update/Delete)
- Tài khoản cần có role ADMIN
- Kiểm tra quyền của user

### TypeScript Errors
- Chạy `npm run build` để kiểm tra lỗi TypeScript
- Đảm bảo tất cả types được import đúng

## 🚀 Build Production

```bash
npm run build
```

File build sẽ được tạo trong thư mục `dist/`

## 🎨 Screenshots

### Màn hình đăng nhập
- Form đăng nhập với validation
- Chuyển đổi sang đăng ký
- Error handling

### Màn hình đăng ký
- Form đầy đủ thông tin
- Validation cho tất cả fields
- Success message

### Màn hình quản lý phim
- Header với thông tin user và nút đăng xuất
- Grid layout responsive
- Search functionality
- CRUD operations

## 📄 License

MIT License - Tự do sử dụng cho mục đích học tập và thương mại.

---

**Developed with ❤️ for Cinema Booking App**  
**Powered by React + TypeScript + JWT Authentication**
