# 3. Hướng Dẫn Tích Hợp Bộ Chuyển Đổi Theme (Theme Switcher)

Tài liệu này hướng dẫn cách cấu hình, tích hợp và hoạt động của chế độ giao diện sáng/tối (Dark Mode) trên hệ thống `erp-corporation-fe-v2`.

---

## 1. Nguyên Lý Hoạt Động (How it works)

DigiERP v2 sử dụng thư viện `next-themes` kết hợp với hệ thống tiện ích của Tailwind CSS để quản lý theme. Nguyên lý hoạt động như sau:

1. **Quản lý lớp (Class Attribute)**:
   - `ThemeProvider` bọc bên ngoài cây component sẽ kiểm soát thuộc tính của thẻ `<html>` (hoặc `<body>`).
   - Khi chọn theme **Dark**, thư viện thêm class `.dark` vào thẻ `<html>` (`<html class="dark">`).
   - Khi chọn theme **Light**, class `.dark` bị loại bỏ.
2. **Đồng bộ hóa màu sắc (CSS Variables)**:
   - Các biến màu được định nghĩa bằng HSL/OKLCH trong `src/index.css`.
   - Khi thẻ `<html>` có class `.dark`, trình duyệt sẽ ưu tiên đọc các biến CSS nằm trong khối `.dark { ... }`.
   - Các class của Tailwind (như `bg-background`, `text-foreground`, `border-border`) sử dụng trực tiếp các biến này, làm toàn bộ giao diện thay đổi màu sắc ngay lập tức.
3. **Mặc định hệ thống (System Default)**:
   - Chế độ `System` sử dụng truy vấn phương tiện của CSS `(prefers-color-scheme: dark)` để đồng bộ giao diện theo cài đặt Windows/macOS của người dùng.

---

## 2. Các File Thay Đổi / Liên Quan

1. **[MODIFY] [main.tsx](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/src/main.tsx)**:
   - Bao bọc toàn bộ ứng dụng bằng `<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>`.
   - Thuộc tính `disableTransitionOnChange` được thêm vào để tăng tốc độ phản hồi và loại bỏ hiệu ứng chuyển tiếp trễ khi render màu.
2. **[NEW] [Header.tsx](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/src/components/layout/Header.tsx)**:
   - Render nút chuyển đổi nhanh (Sun/Moon) ngoài Header (Guest) và Menu con "Giao diện" trong Dropdown Avatar (Auth).
   - Gọi hàm `setTheme('light' | 'dark' | 'system')` để thay đổi trạng thái màu.
3. **[MODIFY] [tailwind.config.js](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/tailwind.config.js)**:
   - Dòng `darkMode: ['class']` chỉ định Tailwind áp dụng các lớp `dark:` dựa trên lớp `.dark` ở thẻ cha cao nhất (`<html>`).
4. **[MODIFY] [index.css](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/src/index.css)**:
   - Định nghĩa chi tiết bảng màu oklch cho cả hai trạng thái `:root` (mặc định) và `.dark`.

---

## 3. Tiêu Chí & Giải Pháp Cải Tiến Chuyên Nghiệp

Để đảm bảo chất lượng UX tốt nhất cho DigiERP:

* **Giải quyết lỗi Flicker/Flash khi tải trang**:
  - Đối với ứng dụng chạy Vite CSR (Client Side Rendering), `next-themes` đọc trực tiếp từ `localStorage` và áp dụng class `.dark` vào thẻ `<html>` ngay trước khi React render ra cây DOM. Điều này ngăn chặn hoàn toàn hiện tượng "nháy trắng" (Flash màn hình) cực kỳ khó chịu khi người dùng tải lại trang lúc nửa đêm.
* **Ngăn ngừa Hydration Mismatch**:
  - Giao diện có thể bị lệch cấu trúc HTML khi render phía client nếu đọc biến theme trước. Thành phần Header giải quyết triệt để vấn đề này bằng cách chỉ hiển thị cụm nút theme sau khi đã mount thành công (`mounted === true`).
* **Tương thích màu sắc Biểu đồ (Charts Color Sync)**:
  - Khi thiết kế các biểu đồ bằng thư viện `recharts`, ta nên truyền các biến CSS (ví dụ: `var(--primary)`) vào các thuộc tính màu sắc thay vì các mã hex cứng như `#3b82f6` hay `#000000`. Điều này giúp biểu đồ tự động đổi màu mượt mà khi người dùng switch theme.
* **Tối ưu hình ảnh và logo**:
  - Sử dụng các lớp CSS để tự động đảo màu hoặc thay đổi hình ảnh logo sáng/tối tương ứng (sử dụng class `dark:invert` hoặc thẻ `<picture>` hỗ trợ media queries).
* **Đồng bộ hóa thư viện bên thứ ba**:
  - Các thông báo `sonner` hoặc bảng dữ liệu `tanstack-table` đã được thiết lập để kế thừa biến CSS theme, đảm bảo đồng bộ 100% không gian làm việc.
