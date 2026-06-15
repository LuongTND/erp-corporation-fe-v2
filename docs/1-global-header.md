# 1. Hướng Dẫn Tích Hợp Header Hệ Thống (Global Header)

Tài liệu này hướng dẫn cách hoạt động, cấu trúc và cách bảo trì thành phần Header dùng chung trên toàn hệ thống trong `erp-corporation-fe-v2`.

---

## 1. Luồng Hoạt Động (Workflow)

Header được tích hợp trực tiếp vào các Layout cha (`AppLayout`, `AuthLayout`, `LandingPage`) để đảm bảo xuất hiện ở mọi phân hệ. Trạng thái của Header phụ thuộc vào việc người dùng đã đăng nhập hay chưa:

### A. Trạng thái Chưa đăng nhập (Guest State)
- **Đường dẫn**: `/`, `/login`, `/portal`
- **Menu điều hướng**: Hiển thị các liên kết cuộn trang giới thiệu (Tính năng, Giải pháp, Bảng giá, Giới thiệu).
- **Bộ điều khiển nhanh (Quick Settings)**:
  - Nút biểu tượng quả địa cầu (Globe) cho phép chuyển ngôn ngữ Việt <-> Anh.
  - Nút biểu tượng mặt trời/mặt trăng cho phép chuyển theme Sáng <-> Tối nhanh.
- **Hành động**:
  - Nút **Đăng nhập** dẫn đến trang chọn vai trò `/portal`.
  - Nút **Đăng ký** dẫn đến trang điền thông tin `/login`.

### B. Trạng thái Đã đăng nhập (Authenticated State)
- **Đường dẫn**: `/dashboard`, `/chat`, `/task`
- **Menu điều hướng**: Hiển thị các liên kết di chuyển nhanh (`/dashboard`, `/chat`, `/task`) sử dụng `NavLink` để highlight trạng thái trang đang hoạt động.
- **Đồng hồ thời gian thực (Clock)**: Hiển thị đồng hồ số chạy liên tục và lịch hiện tại (được dịch tự động theo ngôn ngữ đã chọn).
- **Thành phần thông báo (Notification Popover)**:
  - Hiển thị biểu tượng cái chuông kèm badge đếm số thông báo chưa đọc.
  - Nhấp vào chuông mở Popover hiển thị danh sách thông báo giả lập của ERP.
  - Cho phép người dùng tương tác: Đánh dấu đã đọc từng thông báo, Đọc tất cả, hoặc Xóa tất cả.
- **Avatar Dropdown (Trình điều khiển người dùng)**:
  - Hiển thị avatar của người dùng (nếu không có sẽ tự động tạo chữ viết tắt - initials của tên trên nền màu primary).
  - Nhấp vào avatar hiển thị Dropdown Menu chi tiết chứa:
    - Thông tin cá nhân (Tên, Email, Tag vai trò viết hoa như `ADMIN`, `EMPLOYEE`).
    - Các liên kết Hồ sơ, Cài đặt.
    - Menu con chọn Giao diện (Appearance: Sáng, Tối, Hệ thống).
    - Menu con chọn Ngôn ngữ (Language: Tiếng Việt, English).
    - Nút Đăng xuất (màu đỏ cảnh báo).

---

## 2. Cấu Trúc File & Sơ Đồ Thành Phần

Các thành phần được tách biệt rõ ràng để dễ bảo trì và tái sử dụng:

```text
src/
  ├── components/
  │   └── layout/
  │       ├── Header.tsx                 # Thành phần Header chính điều phối chung
  │       ├── CurrentTime.tsx            # Đồng hồ thời gian thực tự động dịch ngôn ngữ
  │       └── NotificationPopover.tsx    # Hộp thoại thông báo ERP (chứa mock data và logic đọc/xóa)
  ├── features/
  │   └── landing/pages/LandingPage.tsx  # Landing page (thay thế navbar cục bộ bằng Header toàn cục)
  └── components/layout/
      ├── AppLayout.tsx                  # Layout cho các trang sau đăng nhập (Dashboard, Chat, Task)
      └── AuthLayout.tsx                 # Layout cho trang Auth (Login, Portal)
```

---

## 3. Các File Đã Thay Đổi / Liên Quan

1. **[NEW] [Header.tsx](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/src/components/layout/Header.tsx)**: Khởi tạo Header bằng Shadcn.
2. **[NEW] [CurrentTime.tsx](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/src/components/layout/CurrentTime.tsx)**: Xử lý đồng hồ.
3. **[NEW] [NotificationPopover.tsx](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/src/components/layout/NotificationPopover.tsx)**: Xử lý thông báo.
4. **[MODIFY] [AppLayout.tsx](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/src/components/layout/AppLayout.tsx)**: Bọc Header lên trên cùng, tối ưu khung layout làm việc.
5. **[MODIFY] [AuthLayout.tsx](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/src/components/layout/AuthLayout.tsx)**: Bọc Header lên trên biểu mẫu đăng nhập, căn giữa form.
6. **[MODIFY] [LandingPage.tsx](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/src/features/landing/pages/LandingPage.tsx)**: Tích hợp Header toàn cục, tối ưu giao diện dark mode cho các thành phần con.

---

## 4. Những Điểm Cải Tiến Đạt Chuẩn Chuyên Nghiệp

Để mang lại trải nghiệm Wow và chuẩn giao diện cao cấp cho DigiERP:
- **Hiệu ứng Glassmorphism**: Header sử dụng lớp phủ mờ `bg-background/80 backdrop-blur-md sticky top-0` giúp khi scroll nội dung trang bên dưới sẽ mờ đi bên dưới header, đem lại cảm giác hiện đại như hệ điều hành macOS/iOS.
- **Trạng thái Active Link tự động**: Sử dụng `NavLink` của `react-router-dom` giúp tự động thêm background và chữ đậm nổi bật cho trang đang được chọn, người dùng luôn biết mình đang ở đâu.
- **Tương thích hoàn toàn trên Di động**: Tích hợp một mobile menu bằng thành phần `Sheet` (Radix) ẩn. Khi trên thiết bị di động, các liên kết và cấu hình nhanh (theme, language) sẽ tự động được thu gọn vào nút Menu hamburger góc phải, bấm vào sẽ trượt ra ngăn kéo điều hướng cực kỳ mượt mà.
- **Phòng chống Hydration Mismatch**: Tránh hiện tượng nhấp nháy giao diện khi server/client mismatch (đối với Theme hoặc Ngôn ngữ) bằng cách sử dụng hook `mounted` kiểm soát render client-only cho các nút cấu hình giao diện.
- **Trải nghiệm tương tác thực tế**: Nút thông báo không chỉ hiển thị tĩnh mà được cài đặt sẵn state để người dùng có thể nhấp và thay đổi trạng thái (chưa đọc -> đã đọc) trực quan, có âm báo/thông báo pop-up của `sonner`.
