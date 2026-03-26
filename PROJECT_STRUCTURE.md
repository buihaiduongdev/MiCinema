# 📁 CẤU TRÚC DỰ ÁN MICINEMA - GIẢI THÍCH CHI TIẾT

## 🎬 TỔNG QUAN

```
(Repo gốc)
├── .github/         → CI/CD (ví dụ commitlint)
├── .husky/          → Git hooks
├── client/          → ⚛️ Frontend (React)
├── server/          → 🔧 Backend (Express + MongoDB)
├── shared/          → 📦 Shared code (Schemas + Types)
├── package.json     → Dependencies của root
├── commitlint.config.js  → Quy tắc commit message
└── README.md        → Hướng dẫn dự án
```

---

## 🎯 CẤP 1: ROOT LEVEL

### 📄 `package.json`
- **Mục đích**: Quản lý dependencies chung cho monorepo
- **Ghi chú**: Có `workspaces` để link client/, server/, shared/

### 📜 `commitlint.config.js`
- **Mục đích**: Đảm bảo commit messages theo chuẩn (Conventional Commits)
- **Dùng**: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, etc.

### 📋 `LICENSE`
- **Mục đích**: Giấy phép sử dụng dự án

---

## 🔥 CLIENT/ - FRONTEND (REACT)

### 📦 `client/package.json`
- **Mục đích**: Dependencies của React app
- **Key packages**:
  - `react@19` - React framework
  - `vite@7.3` - Build tool (thay cho webpack)
  - `typescript@5.9` - Type checking
  - `@tanstack/react-query` - Server state management
  - `@mantine/core` - UI component library
  - `tailwindcss@4.2` - Styling utility
  - `react-hook-form` - Form management
  - `axios` - HTTP client

### 📐 `client/tsconfig*.json` (3 files)
- **tsconfig.json**: Cấu hình chính cho TypeScript
- **tsconfig.app.json**: TypeScript riêng cho app code
- **tsconfig.node.json**: TypeScript riêng cho config files (Vite)
- **Mục đích**: Kiểm tra type, phát hiện lỗi code

### ⚙️ `client/vite.config.ts`
- **Mục đích**: Cấu hình build tool Vite
- **Ghi chú**: 
  - Thiết lập API proxy đến `http://localhost:5000`
  - Cấu hình TypeScript path aliases (`@/`)
  - Cấu hình environment variables

### 🎨 `client/eslint.config.js`
- **Mục đích**: Cầu hình ESLint (kiểm tra code style)
- **Kiểm tra**: Lỗi syntax, best practices, code quality

### 🌐 `client/index.html`
- **Mục đích**: Entry point HTML, nơi React mount vào `<div id="root">`

---

### 📁 `client/public/`
- **Mục đích**: Tài nguyên tĩnh (ảnh, font, icon, etc.) copy vào build

---

### 📁 `client/src/` - REACT SOURCE CODE

#### **Core Structure**

```
src/
├── App.tsx              → Root component render
├── App.css              → Global styles
├── main.tsx             → Entry point, render React App
├── index.css            → Global CSS variables
├── app/                 → App setup & providers
│   ├── App.tsx          → Main App layout
│   ├── main.tsx         → Initialize app
│   └── providers/       → Setup state & theme
│       ├── QueryProvider.tsx    → TanStack Query wrapper
│       └── ThemeProvider.tsx    → Dark/Light mode provider
├── components/          → Reusable UI components (4 categories)
├── features/            → Feature modules (domain-based)
├── hooks/               → Custom React hooks
├── lib/                 → Utility libraries & config
└── utils/               → Helper functions
```

---

### 📦 `client/src/components/` - REUSABLE COMPONENTS

#### **1. `common/`** - Thành phần chung
- **MovieCard.tsx** - Card hiển thị phim (title, poster, rating)
- **ProtectedRoute.tsx** - HOC bảo vệ route, kiểm tra login
- **RatingStars.tsx** - Hiển thị sao đánh giá (1-5)
- **RoleGuard.tsx** - HOC kiểm tra quyền user (ADMIN/STAFF/CUSTOMER)
- **SearchBar.tsx** - Thanh tìm kiếm phim
- **SeatMap.tsx** - Bản đồ ghế ngồi (interactive, chọn ghế)

#### **2. `form/`** - Form inputs
- **FormInputText.tsx** - Input text field with validation
- **FormPasswordInputText.tsx** - Input password field (hide/show)

#### **3. `layout/`** - Layout wrappers
- **AdminLayout.tsx** - Layout cho admin pages (sidebar + navbar)
- **AppLayout.tsx** - Layout cho user pages (navbar + footer)
- **Navbar.tsx** - Navigation bar (logo, menu, user profile)
- **Sidebar.tsx** - Sidebar menu (admin)
- **Footer.tsx** - Footer (copyright, links)

#### **4. `ui/`** - UI Primitives (Mantine + Custom)
- **Button.tsx** - Nút bấm (primary, secondary, danger)
- **ConfirmDialog.tsx** - Hộp xác nhận (delete, cancel)
- **DataTable.tsx** - Bảng dữ liệu (admin)
- **EmptyState.tsx** - Trạng thái rỗng (không có dữ liệu)
- ... (và các UI component khác)

---

### 🎯 `client/src/features/` - FEATURE MODULES (Domain-based)

**Mục đích**: Mỗi feature tự chứa logic, components, hooks, API integration của riêng nó

#### **1. `features/auth/`** - Xác thực
```
auth/
├── components/
│   ├── LoginForm.tsx     → Form đăng nhập
│   └── RegisterForm.tsx  → Form đăng ký
├── hooks/
│   └── useAuthMutation.ts → API call login/register/logout
├── pages/
│   ├── LoginPage.tsx     → Login page
│   └── RegisterPage.tsx  → Register page
├── services/
│   └── authApi.ts        → API endpoints (POST /auth/login, etc.)
├── contexts/
│   └── AuthContext.tsx   → Store user info + token (global state)
└── types/
    └── types.ts          → TypeScript interfaces
```

#### **2. `features/movies/`** - Quản lý phim
```
movies/
├── components/
│   ├── MovieList.tsx     → Danh sách phim
│   ├── MovieFilter.tsx   → Lọc phim (genre, rating)
│   └── MovieDetail.tsx   → Chi tiết phim
├── pages/
│   └── MoviesPage.tsx    → Trang danh sách phim
├── services/
│   └── moviesApi.ts      → API endpoints (GET /movies, etc.)
├── hooks/
│   └── useMovies.ts      → React Query hook lấy phim
└── types/
    └── types.ts          → Movie interface
```

#### **3. `features/booking/`** - Đặt vé
```
booking/
├── components/
│   ├── ShowtimeSelect.tsx  → Chọn suất chiếu
│   ├── SeatSelection.tsx   → Chọn ghế (dùng SeatMap)
│   └── BookingSummary.tsx  → Tóm tắt đơn hàng
├── pages/
│   ├── BookingPage.tsx     → Trang đặt vé
│   └── BookingSuccess.tsx  → Trang xác nhận thành công
├── services/
│   ├── bookingApi.ts       → API endpoints
│   └── paymentApi.ts       → API thanh toán
├── hooks/
│   ├── useBooking.ts       → React Query hook
│   └── usePayment.ts       → Payment hook
└── context/
    └── BookingContext.tsx  → State từng bước booking
```

#### **4. `features/food/`** - Đặt đồ ăn
```
food/
├── components/
│   ├── ProductList.tsx     → Danh sách sản phẩm
│   ├── CartPreview.tsx     → Giỏ hàng
│   └── OrderSummary.tsx    → Tóm tắt đơn hàng
├── pages/
│   └── FoodOrderPage.tsx   → Trang đặt đồ ăn
├── services/
│   └── foodApi.ts          → API endpoints
├── hooks/
│   └── useFoodOrder.ts     → Order state
└── context/
    └── CartContext.tsx     → Giỏ hàng global state
```

#### **5. `features/loyalty/`** - Chương trình loyalty
```
loyalty/
├── components/
│   ├── PointsDisplay.tsx   → Hiển thị điểm
│   ├── TierBadge.tsx       → Badge cấp độ (Bronze/Silver/Gold)
│   └── RedeemModal.tsx     → Modal đổi điểm
├── pages/
│   └── LoyaltyPage.tsx     → Trang loyalty
├── services/
│   └── loyaltyApi.ts       → API endpoints
└── hooks/
    └── useLoyalty.ts       → Loyalty data hook
```

#### **6. `features/user/`** - Hồ sơ người dùng
```
user/
├── components/
│   ├── ProfileForm.tsx     → Form chỉnh sửa hồ sơ
│   ├── BookingHistory.tsx  → Lịch sử đặt vé
│   └── SettingsPanel.tsx   → Cài đặt
├── pages/
│   └── ProfilePage.tsx     → Trang hồ sơ
├── services/
│   └── userApi.ts          → API endpoints
└── hooks/
    └── useUserProfile.ts   → Profile data hook
```

#### **7. `features/admin/`** - Dashboard admin
```
admin/
├── components/
│   ├── MovieManager.tsx    → Quản lý phim
│   ├── ShowtimeManager.tsx → Quản lý suất chiếu
│   ├── RoomManager.tsx     → Quản lý phòng chiếu
│   ├── StatsPanel.tsx      → Thống kê doanh thu
│   └── UserManagement.tsx  → Quản lý người dùng
├── pages/
│   └── AdminPage.tsx       → Trang admin
├── services/
│   ├── adminApi.ts         → API endpoints
│   └── statsApi.ts         → API thống kê
└── hooks/
    └── useAdmin.ts         → Admin data hooks
```

---

### 🪝 `client/src/hooks/` - CUSTOM HOOKS

- **useAuth.ts** - Access auth context (user, token, logout)
- **useDebounce.ts** - Debounce search input (delay API call)
- **useLocalStorage.ts** - Persist state to localStorage
- **usePagination.ts** - Pagination logic (page, limit, offset)

---

### 📚 `client/src/lib/` - LIBRARY CONFIG

- **api-client.ts** - Axios instance với interceptor (auth, error)
- **dayjs.ts** - Date/time format config
- **query-client.ts** - TanStack Query config (stale time, retry)

---

### 🛠️ `client/src/utils/` - HELPER FUNCTIONS

- **cn.ts** - Merge CSS classes (Tailwind utility)
- **constants.ts** - App constants (URLs, limits)
- **format.ts** - Format functions (date, money, numbers)

---

## 🔧 SERVER/ - BACKEND (EXPRESS)

### 📦 `server/package.json`
- **Mục đích**: Dependencies của Node.js server
- **Key packages**:
  - `express@5.1` - Web framework
  - `typescript@5.8` - Type checking
  - `mongoose@8.12` - MongoDB ODM
  - `jsonwebtoken` - JWT authentication
  - `bcryptjs` - Password hashing
  - `multer@2.0` - File upload
  - `node-cron@4.0.5` - Cron jobs
  - `nodemailer@7.0.3` - Email sending
  - `cors@2.8.5` - Cross-origin

### 📐 `server/tsconfig.json`
- **Mục đích**: TypeScript config cho server
- **Thiết lập**: Path aliases (`@/` → `src/`)

---

### 📁 `server/src/` - SERVER SOURCE CODE

#### **`app.ts`** - Express app setup
- **Mục đích**: Khởi tạo Express app, đăng ký routes, middleware
- **Ghi chú**: 
  - Thiết lập CORS
  - JSON parser
  - Route handlers
  - Global error handler

#### **`index.ts`** - Server entry point
- **Mục đích**: Start server, connect database
- **Ghi chú**: `app.listen(PORT, callback)`

---

### 📁 `server/src/config/` - CONFIGURATION

- **env.ts** - Parse environment variables (MONGODB_URI, JWT_SECRET, PORT)
- **database.ts** - MongoDB Mongoose connection
- **cors.ts** - CORS whitelist config (frontend URL, methods)

---

### 📁 `server/src/middlewares/` - MIDDLEWARE

- **auth.middleware.ts**
  - `protect()` - Kiểm tra JWT token từ header
  - Ghi vào `req.user` (decoded token data)
  - Kiểm tra account còn active (!isDeleted)

- **error.middleware.ts**
  - Catch tất cả errors từ routes
  - Format response (status, message, errors)
  - Handle Zod validation errors

- **validate.middleware.ts**
  - `validate(schema)` - Factory middleware
  - Xác thực req.body, req.query, req.params
  - Throw ZodError nếu invalid

- **upload.middleware.ts**
  - Multer config cho file upload
  - Validation file size, type
  - Save vào folder `uploads/`

---

### 📁 `server/src/models/` - DATABASE SCHEMAS

Toàn bộ Mongoose schemas (MongoDB documents):

- **User.model.ts** - User collection
  ```
  - email, password (bcrypt), fullName, phone, avatar
  - role (ADMIN, STAFF, CUSTOMER)
  - loyaltyPoints, membershipTier (BRONZE, SILVER, GOLD)
  - isActive, isDeleted, timestamps
  ```

- **Movie.model.ts** - Movie collection
  ```
  - title, description, director, actors[], genres[]
  - duration, releaseDate, endDate
  - poster, trailer, rating
  - status (UPCOMING, RELEASED, ENDED)
  ```

- **CinemaRoom.model.ts** - Cinema room collection
  ```
  - name, roomType, rows, cols
  - seats[] (embedded: type, seatNumber, isReserved)
  - isActive
  ```

- **Showtime.model.ts** - Showtime collection
  ```
  - movieId → Movie
  - roomId → CinemaRoom
  - startTime, ticketPrice
  - status (OPEN, FULL, CLOSED)
  ```

- **Booking.model.ts** - Booking collection
  ```
  - userId → User
  - showtimeId → Showtime
  - seats[] (A1, A2, etc.)
  - totalPrice, status (PENDING, PAID, COMPLETED, CANCELLED)
  - timestamps
  ```

- **Product.model.ts** - Food product collection
  ```
  - name, price, category (POPCORN, DRINK, COMBO)
  - description, image
  - comboItems[] (product refs)
  - isActive
  ```

- **FoodOrder.model.ts** - Food order collection
  ```
  - userId → User
  - bookingId → Booking (optional)
  - items[] (productId, quantity, price)
  - totalAmount, status
  ```

- **LoyaltyHistory.model.ts** - Loyalty history collection
  ```
  - userId → User
  - points, action (EARN, REDEEM, EXPIRE)
  - description, bookingId (optional)
  - timestamps
  ```

- **index.ts** - Export tất cả models

---

### 📁 `server/src/modules/` - FEATURE MODULES (Service Layer)

Cấu trúc MVC: `routes` → `controller` → `service`

#### **1. `auth/`** - Xác thực
```
auth/
├── auth.routes.ts       → POST /auth/register, POST /auth/login, GET /auth/me
├── auth.controller.ts   → Handlers (register, login, getMe)
├── auth.service.ts      → Business logic (createUser, comparePassword, generateToken)
└── auth.types.ts        → TypeScript interfaces
```

#### **2. `bookings/`** - Đặt vé
```
bookings/
├── booking.routes.ts    → GET /bookings, POST /bookings, PUT /bookings/:id
├── booking.controller.ts
├── booking.service.ts   → Create, update, cancel booking
└── booking.types.ts
```

#### **3. `movies/`** - Phim
```
movies/
├── movie.routes.ts      → GET /movies, GET /movies/:id, POST /movies (admin)
├── movie.controller.ts
├── movie.service.ts
└── movie.types.ts
```

#### **4. `showtimes/`** - Lịch chiếu
```
showtimes/
├── showtime.routes.ts
├── showtime.controller.ts
├── showtime.service.ts
└── showtime.types.ts
```

#### **5. `rooms/`** - Phòng chiếu
```
rooms/
├── room.routes.ts
├── room.controller.ts
├── room.service.ts
└── room.types.ts
```

#### **6. `food/`** - Đồ ăn
```
food/
├── food.routes.ts       → POST /food/orders, GET /food/orders
├── food.controller.ts
├── food.service.ts
└── food.types.ts
```

#### **7. `loyalty/`** - Loyalty
```
loyalty/
├── loyalty.routes.ts
├── loyalty.controller.ts
├── loyalty.service.ts
└── loyalty.types.ts
```

#### **8. `payments/`** - Thanh toán
```
payments/
├── payment.routes.ts
├── payment.controller.ts
├── payment.service.ts
└── payment.types.ts
```

#### **9. `statistics/`** - Thống kê
```
statistics/
├── statistics.routes.ts → GET /stats/revenue, GET /stats/bookings
├── statistics.controller.ts
├── statistics.service.ts
└── statistics.types.ts
```

#### **10. `users/`** - Người dùng
```
users/
├── user.routes.ts      → GET /users/me, PUT /users/profile
├── user.controller.ts
├── user.service.ts
└── user.types.ts
```

---

### 📁 `server/src/jobs/` - BACKGROUND CRON JOBS

- **autoRewardPoints.ts** 
  - Hàm: Tự động tích điểm sau khi thanh toán
  - Cron: Chạy hàng ngày lúc 00:00
  - Logic: Tính điểm = totalAmount / ratio, update tier

- **updateStatuses.ts**
  - Hàm: Cập nhật trạng thái phim/booking/showtime
  - Cron: Chạy hàng giờ
  - Logic: UPCOMING→RELEASED→ENDED dựa vào ngày

- **releaseExpiredSeats.ts**
  - Hàm: Giải phóng ghế từ đơn PENDING quá lâu
  - Cron: Chạy mỗi 15 phút
  - Logic: Xóa reserved seats nếu quá timeout

- **sendReminder.ts**
  - Hàm: Gửi email nhắc nhở booking
  - Cron: Chạy mỗi ngày trước giờ chiếu
  - Logic: Query bookings trong 24h tới, send email

---

### 🛠️ `server/src/utils/` - HELPER FUNCTIONS

- **jwt.ts** - `generateToken()`, `verifyToken()` functions
- **pagination.ts** - `paginate()` helper (page, limit → skip, limit)
- **response.ts** - `sendSuccess()`, `sendError()` response formatters
- **token.ts** - Token parsing from headers
- **upload.util.ts** - File upload helpers

---

### 🌱 `server/src/seed/` - DATABASE SEEDING

- **seed.ts** - Script để populate database với test data
  - Tạo users demo
  - Tạo movies demo
  - Tạo rooms + showtimes
  - Dùng: `npm run seed`

---

## 📦 SHARED/ - SHARED CODE

### **Mục đích**: Chia sẻ schemas, types, constants giữa client & server

### 📦 `shared/package.json`
- Chứa Zod + TypeScript

### 📐 `shared/tsconfig.json`
- TypeScript config cho shared

---

### 📁 `shared/constants/`

- **roles.ts** - Enum roles
  ```typescript
  ADMIN, STAFF, CUSTOMER
  ```

- **seat-types.ts** - Enum ghế
  ```typescript
  NORMAL, VIP, COUPLE
  ```

- **statuses.ts** - Enum trạng thái
  ```typescript
  UPCOMING, RELEASED, PENDING, PAID, COMPLETED, etc.
  ```

---

### 📁 `shared/schemas/` - ZOD VALIDATION SCHEMAS

**Mục đích**: Single source of truth cho validation + types

- **auth.schema.ts**
  ```typescript
  registerSchema - email, password, fullName
  loginSchema - email, password
  ```

- **user.schema.ts**
  ```typescript
  userSchema - email, fullName, phone, role
  ```

- **movie.schema.ts**
  ```typescript
  movieSchema - title, description, poster, trailer, etc.
  ```

- **booking.schema.ts**
  ```typescript
  bookingSchema - showtimeId, seatIds, totalPrice
  ```

- **showtime.schema.ts**
  ```typescript
  showtimeSchema - movieId, roomId, startTime, ticketPrice
  ```

- **room.schema.ts**
  ```typescript
  roomSchema - name, roomType, rows, cols
  ```

- **food.schema.ts**
  ```typescript
  productSchema - name, price, category
  foodOrderSchema - items[], totalAmount
  ```

- **loyalty.schema.ts**
  ```typescript
  loyaltySchema - points, action, description
  ```

- **common.schema.ts**
  ```typescript
  paginationSchema - page, limit
  idSchema - id validation
  ```

- **api.type.ts**
  ```typescript
  API Response types
  Error types
  Pagination types
  ```

---

### 📁 `shared/index.ts`
- **Mục đích**: Export tất cả constants + schemas cho dễ import

---

## 📊 WORKFLOW INTEGRATION

### **Monorepo Setup**
```json
{
  "workspaces": ["client", "server", "shared"]
}
```
- NPM tự động link dependencies giữa packages
- `npm install` ở root cài tất cả

### **Build & Development**
```bash
# Client
npm run dev --workspace=client    # Start Vite dev server

# Server  
npm run dev --workspace=server    # Start Express server

# Both
npm run dev                       # Start both in parallel
```

### **Environment Variables**

**Client** (.env.local):
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=MiCinema
```

**Server** (.env):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/micinema
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## 📋 SUMMARY TABLE

| Folder | Mục đích | Tech |
|--------|---------|------|
| `client/src/components/` | UI components tái sử dụng | React + Mantine |
| `client/src/features/` | Business logic mỗi domain | React + Hooks |
| `client/src/lib/` | Config libraries | Axios, Query, dayjs |
| `server/src/models/` | Database schemas | Mongoose |
| `server/src/modules/` | API routes + logic | Express + Service |
| `server/src/config/` | Environment + Database | dotenv, Mongoose |
| `server/src/middlewares/` | Auth, validation, error | Express |
| `server/src/jobs/` | Background tasks | node-cron |
| `shared/schemas/` | Validation rules | Zod |
| `shared/constants/` | Enums + constants | TypeScript |

---

## 🔄 DATA FLOW EXAMPLE: Đặt vé phim

### **Frontend Flow**
```
1. MovieCard click → MoviesPage
2. User chọn suất chiếu → BookingPage
3. Chọn ghế → SeatMap component
4. Submit → bookingApi.createBooking()
5. API call → server POST /api/bookings
6. Await response → React Query update
7. Success → BookingSuccess page + loyaltyPoints update
```

### **Backend Flow**
```
1. POST /api/bookings
2. validate() middleware → Zod check
3. protect() middleware → Check JWT
4. bookingController.createBooking()
5. bookingService.create()
   - Create booking document
   - Reserve seats in CinemaRoom
   - Calculate price
6. autoRewardPoints job → Award points later
7. Return response
```

### **Database Changes**
```
User.loyaltyPoints ↑ (add points)
User.membershipTier ↑ (if tier up)
Booking ↑ (new booking created)
CinemaRoom.seats ↑ (update reserved status)
LoyaltyHistory ↑ (log action)
```

---

Bây giờ bạn hiểu rõ:
- ✅ Mỗi folder dùng làm gì
- ✅ Quan hệ data flow
- ✅ Cấu trúc MVC/Service
- ✅ Monorepo setup

**Bạn có muốn tôi đi sâu vào bất kỳ phần nào hay code cụ thể không?** 🚀
