# 🗺️ Hướng Dẫn Onboarding & Tài Liệu Cấu Trúc Hệ Thống (DigiERP v2)

Chào mừng bạn gia nhập đội ngũ phát triển **DigiERP v2**! 🚀

Tài liệu này được biên soạn nhằm giúp bạn – một thành viên mới trong team – nhanh chóng nắm vững toàn bộ luồng vận hành, kiến trúc thư mục, cấu hình hệ thống (Axios, Router, Auth) và cách thức dòng code chạy từ điểm xuất phát. Hãy đọc kỹ tài liệu này để có thể bắt tay vào phát triển tính năng mới một cách nhanh chóng và tự tin nhất.

---

## 1. Luồng Giao Diện (UI Flow) Chính

Hệ thống được chia thành 2 trạng thái giao diện cốt lõi: **Giao diện công cộng (Guest/Public)** và **Giao diện nội bộ (Authenticated/Protected)**.

```
                  +-------------------------+
                  |  Landing Page (Public)  |
                  +------------+------------+
                               |
                               v
                     +---------+---------+
                     |    Portal Page    | (Chọn vai trò: Admin, Manager, Employee)
                     +---------+---------+
                               | (Redirect kèm query ?role=...)
                               v
                     +---------+---------+
                     |    Login Page     | (Nhập Email / Password)
                     +---------+---------+
                               | (Đăng nhập thành công)
                               v
                   +-----------+-----------+
                   |  Dashboard (AppLayout)| (Làm việc chính)
                   +-----+-----------+-----+
                         |           |
        +----------------v--+     +--v----------------+
        |     Chat Page     |     |     Task Page     |
        +-------------------+     +-------------------+
```

### A. Chi tiết luồng đi của User
1. **Landing Page (`/`)**: Giao diện giới thiệu công cộng (Tính năng, Bảng giá, Liên hệ). 
   - Nếu chưa đăng nhập: Hiển thị Header công cộng. Nút **Đăng nhập** dẫn đến `/portal`, nút **Đăng ký** dẫn đến `/login`.
   - Nếu đã đăng nhập: Header tự động hiển thị Avatar và đồng hồ, nút đăng nhập đổi thành nút truy cập **Dashboard**.
2. **Portal Page (`/portal`)**: Trang trung gian hiển thị danh sách các vai trò (Roles) trong hệ thống bao gồm: **Quản Trị Hệ Thống (Admin)**, **Quản Lý (Manager)**, **Nhân Viên (Employee)**.
   - Khi chọn một vai trò, user sẽ được chuyển đến trang đăng nhập kèm tham số: `/login?role=manager` hoặc `/login?role=admin`.
3. **Login Page (`/login`)**: Hiển thị Form đăng nhập. Tiêu đề và mô tả sẽ thay đổi linh hoạt theo vai trò đã chọn ở Portal (đọc từ query parameter `?role`). Sau khi nhập thông tin chính xác, hệ thống sẽ thực hiện đăng nhập và điều hướng user vào trang làm việc nội bộ.
4. **Trang nội bộ (`/dashboard`, `/chat`, `/task`)**: Nằm trong khung giao diện `AppLayout` với Sidebar điều hướng bên trái và Global Header phía trên (có đồng hồ, hòm thông báo Popover, và nút Avatar).

---

### B. Các trường hợp đặc biệt (Edge Cases) & Luồng xử lý lỗi

#### 🚨 Case 1: Đăng nhập sai vai trò (Role Mismatch)
* **Tình huống**: User nhấn chọn vai trò **Admin** trên Portal (`/login?role=admin`) nhưng lại nhập tài khoản của một **Nhân viên (Employee)**.
* **Cách xử lý**: 
  - Tại hàm `login()` ở `useAuth` hook, sau khi giải mã Token thành công, hệ thống sẽ kiểm tra: `decodedUser.role !== expectedRole` (`employee !== admin`).
  - Hệ thống sẽ chặn ngay lập tức, không lưu Token vào store, quăng lỗi `'Tài khoản của bạn không có quyền truy cập hệ thống này.'` và hiển thị thông báo lỗi (Toast error) cho user. User vẫn ở lại trang đăng nhập.

#### 🚨 Case 2: Đã đăng nhập nhưng truy cập trang không có quyền (Authorization - 403 Forbidden)
* **Tình huống**: Một user đăng nhập với vai trò **Nhân viên (Employee)** cố tình gõ link trên thanh địa chỉ truy cập vào phân hệ Admin: `/admin/settings`.
* **Cách xử lý**:
  - Khi Router khớp đường dẫn `/admin/settings`, nó sẽ chạy qua lớp bảo mật `RoleGuard`.
  - `RoleGuard` gọi hàm `hasAccess('/admin/settings', 'employee')` (được cấu hình trong [permissions.ts](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/src/config/permissions.ts)).
  - Vì cấu hình chỉ cho phép role `'admin'` truy cập, hàm trả về `false`.
  - `RoleGuard` ngay lập tức render component `<ForbiddenPage />` (trang báo lỗi 403 độc lập hiển thị thông báo: *"Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên."* kèm nút quay lại Dashboard).

#### 🚨 Case 3: Token hết hạn khi đang sử dụng (Unauthorized - 401)
* **Tình huống**: User đang mở trang làm việc thì Access Token (thời hạn ngắn) bị hết hạn. User click gửi một yêu cầu API.
* **Cách xử lý**:
  - Interceptor response của Axios phát hiện lỗi `status === 401`.
  - Nó tạm dừng yêu cầu hiện tại, bật cờ `isRefreshing = true` để gom các request tiếp theo vào hàng đợi `pendingRequests`.
  - Axios tự động tạo một request ngầm gửi Refresh Token lên `/auth/refresh`.
  - **Nếu Refresh thành công**: Nhận Access Token mới, lưu vào `localStorage`, chạy tiếp toàn bộ request đang đợi trong hàng đợi, người dùng không hề nhận ra sự gián đoạn (Zero-interruption).
  - **Nếu Refresh thất bại** (hoặc Refresh Token cũng hết hạn): Xóa sạch session (Zustand & `localStorage`) và đẩy người dùng về trang Portal `/portal` để đăng nhập lại.

---

## 2. Cấu Trúc Thư Mục & Cấu Hình Hệ Thống

Để dự án đạt tiêu chuẩn chuyên nghiệp của các dự án lớn, cấu trúc thư mục được tổ chức theo mô hình **Feature-based** (chia theo nghiệp vụ) kết hợp với các folder cấu hình tập trung.

### A. Sơ đồ thư mục tổng quát
```
src/
├── app/                        # Nơi khởi chạy & Định tuyến ứng dụng
│   ├── guards/                 # Các chốt kiểm soát truy cập (Route Guards)
│   └── router.tsx              # Cấu hình React Router v6
│
├── config/                     # Cấu hình tĩnh & Quyền hạn (Single Source of Truth)
│   ├── auth.config.ts          # Redirects và thông tin vai trò trên Portal
│   ├── permissions.ts          # Bản đồ phân quyền Route (PERMISSION_MAP)
│   ├── roles.ts                # Định nghĩa các hằng số Role (admin, manager, employee)
│   └── routes.ts               # Định nghĩa các hằng số URL path (ROUTES)
│
├── lib/                        # Khởi tạo các thư viện dùng chung (Thư viện + Config)
│   ├── axios.ts                # Cấu hình gốc Axios (Interceptors, Token refresh)
│   ├── api.ts                  # Wrapper đóng gói các method GET, POST, PUT, DELETE
│   ├── query-client.ts         # Cấu hình React Query Client
│   └── i18n.ts                 # Cấu hình đa ngôn ngữ (react-i18next)
│
├── stores/                     # Quản lý State toàn cục phía Client (Zustand)
│   └── auth.store.ts           # Lưu trữ thông tin User, token, trạng thái đăng nhập
│
├── features/                   # Chứa các mô-đun nghiệp vụ chính (Mỗi feature là 1 folder tự quản)
│   ├── auth/                   # Phân hệ Xác thực (Login, Portal, Forbidden pages)
│   ├── landing/                # Phân hệ Giới thiệu (Landing page)
│   ├── chat/                   # Phân hệ Chat nội bộ
│   └── task/                   # Phân hệ Quản lý công việc (Kanban)
│
├── components/                 # Các Component dùng chung toàn dự án
│   ├── ui/                     # Shadcn components (Button, Input, Card, Popover...)
│   └── layout/                 # Layouts (AppLayout, AuthLayout, Header, Sidebar...)
│
├── types/                      # Định nghĩa kiểu dữ liệu TypeScript dùng chung
└── utils/                      # Helper functions dùng chung (formatters, validators...)
```

---

### B. Vị trí và Thiết kế các Config chính

#### 1. Cấu hình Axios (`src/lib/axios.ts` và `src/lib/api.ts`)
* **Tại sao đặt ở đây?**: `src/lib` là nơi lý tưởng để cấu hình các thư viện bên ngoài. Việc tách biệt `axios.ts` (xử lý cơ sở hạ tầng mạng, token, refresh queue) và `api.ts` (đóng gói kiểu dữ liệu trả về) giúp code sạch và dễ bảo trì.
* **Đặc điểm chuẩn hóa**: 
  - Tự động đính kèm header `Authorization: Bearer <token>` thông qua **Request Interceptor**.
  - Xử lý xếp hàng (Queueing) các API bị gián đoạn do token hết hạn, tránh việc gọi refresh token nhiều lần đồng thời.

#### 2. Cấu hình Router (`src/app/router.tsx` & `src/config/routes.ts`)
* **Đặc điểm chuẩn hóa**:
  - Không hardcode chuỗi đường dẫn trong Router. Toàn bộ URL paths được quản lý tập trung tại `src/config/routes.ts` dưới dạng đối tượng đóng băng (`as const`). Khi cần sửa đổi URL, bạn chỉ cần sửa tại một file duy nhất.
  - Áp dụng **Lazy Loading** (`lazy` + `<Suspense>`) cho các Page lớn (`ChatPage`, `TaskPage`, layouts) để giảm dung lượng file bundle ban đầu, tăng tốc độ load trang lần đầu.

#### 3. Cấu hình Quyền & Vai trò (`src/config/permissions.ts` & `src/app/guards/`)
* **Đặc điểm chuẩn hóa**:
  - Phân quyền theo dạng **Declarative (Khai báo)** thông qua `PERMISSION_MAP`. Chỉ cần nhìn vào map này, bạn sẽ biết ngay route nào dành cho role nào.
  - Sử dụng giải thuật match tiền tố dài nhất (longest prefix matching) tại `getRoutePermission` để xử lý các route con động một cách chính xác.

---

## 3. Luồng Chạy Code & Hướng Dẫn Đọc Code Cho Dev Mới

Để giúp bạn biết phải bắt đầu đọc từ đâu và luồng code chạy như thế nào khi user tương tác, dưới đây là sơ đồ chi tiết từng bước.

### A. Khởi tạo ứng dụng (Điểm xuất phát)

Khi ứng dụng chạy trên trình duyệt, trình tự tải như sau:

```
[index.html]
    │ (Tải script entrypoint)
    ▼
[src/main.tsx]
    │ (Khởi chạy React Root)
    ├─► Tải CSS toàn cục: import '@/index.css'
    ├─► Cấu hình i18n: import './lib/i18n'
    ├─► Bao bọc React Query Provider: <QueryClientProvider>
    ├─► Bao bọc Theme Provider: <ThemeProvider> (xử lý dark mode)
    └─► Bắt đầu Router: <RouterProvider router={router} />
```

---

### B. Luồng hoạt động chi tiết: Khi User Đăng Nhập

Hãy theo dõi đường đi của dữ liệu qua các hàm và component khi user thực hiện đăng nhập từ vai trò **Manager**:

```
1. Click "Quản lý" trên PortalPage.tsx 
   ──► Link tới '/login?role=manager'
   
2. LoginPage.tsx nhận tham số 'role=manager' từ URL
   ──► Render <LoginForm />
   
3. User nhập Form & nhấn "Đăng nhập"
   ──► Kích hoạt onSubmit() trong LoginForm.tsx
   
4. onSubmit() gọi hàm login(credentials, 'manager') 
   ──► Hàm login định nghĩa tại hook useAuth.ts
   
5. login() gọi authService.login(credentials)
   ──► Định nghĩa tại services/auth.service.ts
   
6. authService.login() sử dụng wrapper apiCall.post()
   ──► Thực hiện request qua Axios instance (lib/axios.ts)
   
7. API trả về JSON chứa { accessToken, refreshToken }
   ──► Trả ngược data về cho hook useAuth.ts
   
8. useAuth.ts xử lý:
   ├─► Decode accessToken lấy user info (id, name, role) qua decodeUserFromToken()
   ├─► Kiểm tra vai trò: role decode (manager) trùng khớp với expectedRole (manager) -> OK
   ├─► Lưu vào Zustand store & localStorage qua authStore.setAuth()
   └─► Điều hướng người dùng: navigate(ROLE_REDIRECTS['manager']) -> Đưa user tới '/dashboard'
```

---

### C. Luồng hoạt động chi tiết: Khi User truy cập một trang được bảo vệ (`/chat`)

Khi user đã đăng nhập và truy cập trang `/chat`, luồng kiểm tra chốt chặn diễn ra như sau:

```
1. Trình duyệt trỏ tới '/chat'
   ──► Khớp Router tree trong src/app/router.tsx
   
2. Đi qua Chốt chặn 1: <ProtectedRoute />
   ──► Đọc `isAuthenticated` từ useAuthStore()
   ──► Kết quả: true (Cho phép đi qua chốt tiếp theo)
   
3. Đi qua Chốt chặn 2: <RoleGuard />
   ──► Lấy thông tin user.role hiện tại ('manager')
   ──► Lấy route pathname đang truy cập ('/chat')
   ──► Gọi hasAccess('/chat', 'manager')
   ──► Kiểm tra PERMISSION_MAP: '/chat' cho phép nhóm ROLE_GROUPS.ALL (trong đó có manager)
   ──► Kết quả: true (Cho phép đi qua chốt tiếp theo)
   
4. Render Layout chung: <AppLayout />
   ──► Render <Header /> (Chứa đồng hồ CurrentTime, hộp thông báo NotificationPopover, nút Avatar)
   ──► Render <Sidebar />
   
5. Render Component trang đích trong Outlet: <ChatPage />
   ──► Khởi chạy component ChatPage
```

---

## 4. Code Thuần (Vanilla/Custom) vs Thư Viện Hỗ Trợ

Khi đọc code, bạn cần phân biệt rõ đâu là phần logic nghiệp vụ do team chúng ta tự viết (Vanilla/Custom Code) và đâu là các công cụ hỗ trợ từ thư viện bên ngoài để tránh việc phát minh lại bánh xe.

| Phạm vi nghiệp vụ | Custom Code (Do team viết) | Library (Thư viện hỗ trợ) | Vai trò của thư viện |
| :--- | :--- | :--- | :--- |
| **Routing** | `src/app/router.tsx`<br>`src/config/routes.ts` | `react-router-dom` | Cung cấp bộ máy định tuyến, component `<Outlet />`, `<Navigate />`, hook `useNavigate`, `useLocation`. |
| **HTTP Client** | `src/lib/axios.ts`<br>`src/lib/api.ts`<br>`src/services/` | `axios` | Gửi request, quản lý header, cấu hình timeout, hỗ trợ interceptors. |
| **State Management** | `src/stores/auth.store.ts` | `zustand` | Cung cấp hàm `create` tạo store siêu nhẹ, middleware `persist` lưu trạng thái xuống `localStorage`. |
| **Server Cache** | Các custom hooks dạng `useProducts.ts`, `useMessages.ts` | `@tanstack/react-query` | Quản lý cache dữ liệu từ API, tự động fetch lại khi focus màn hình, xử lý trạng thái Loading/Error/Success. |
| **Form & Validation** | `src/features/auth/auth.schema.ts` | `react-hook-form`<br>`zod`<br>`@hookform/resolvers/zod` | **React Hook Form**: Quản lý state của input.<br>**Zod**: Định nghĩa schema và validate dữ liệu đầu vào.<br>**Resolvers**: Cầu nối giữa Zod và React Hook Form. |
| **UI Components** | `src/components/layout/Header.tsx`<br>`src/components/layout/AppLayout.tsx` | `shadcn/ui` (Radix UI + Tailwind CSS) | Cung cấp các component nguyên mẫu chất lượng cao, dễ tùy biến style bằng CSS classes và tương thích tốt (accessible). |
| **Localization** | `src/lib/i18n.ts` | `i18next`<br>`react-i18next` | Cung cấp hook `useTranslation`, hàm dịch `t()`, quản lý file JSON dịch ngôn ngữ. |
| **Appearance** | Thiết lập HSL colors ở `index.css` | `next-themes` | Tự động thêm/bớt class `.dark` vào thẻ `<html>` và lưu cấu hình theme. |

---

## 💡 Lời Khuyên Cho Member Mới
1. **Bắt đầu từ file nhỏ**: Đừng cố đọc toàn bộ dự án cùng một lúc. Hãy bắt đầu từ [main.tsx](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/src/main.tsx) -> [router.tsx](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/src/app/router.tsx) -> các chốt chặn `guards/` để thông suốt tư duy bảo mật.
2. **Tuân thủ Folder nghiệp vụ**: Khi được giao làm tính năng mới (ví dụ: *Quản lý nhà cung cấp - Suppliers*), hãy tuân thủ cấu trúc thư mục feature bằng cách tạo một thư mục độc lập `src/features/suppliers/` chứa đầy đủ pages, components, hooks, services riêng biệt thay vì ném chung vào folder components dùng chung.
3. **Luôn sử dụng Route Path Constants**: Tuyệt đối không hardcode link dạng `<Link to="/admin/accounts">`. Hãy sử dụng `<Link to={ROUTES.ADMIN.ACCOUNTS}>` để đảm bảo hệ thống có một nguồn chân lý duy nhất.

Chúc bạn có những trải nghiệm lập trình tuyệt vời cùng dự án DigiERP v2! Nếu có bất kỳ câu hỏi nào, hãy liên hệ ngay với các thành viên khác trong team để được hỗ trợ. Happy coding! 💻✨
