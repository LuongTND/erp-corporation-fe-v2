# Báo Cáo Kết Quả Refactor Layout & Router

Tài liệu này tổng hợp chi tiết các thay đổi trong đợt refactor cấu trúc Layout và chuẩn hóa Router trong dự án `erp-corporation-fe-v2`.

---

## 1. Các Thay Đổi Chính (Core Changes)

### A. Chuẩn hóa & Centralize đường dẫn (Routes Configuration)
* **File thay đổi:** [routes.ts](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/src/config/routes.ts)
* **Chi tiết:** Tách toàn bộ các đường dẫn viết cứng (hardcoded paths) của các phân hệ vào đối tượng `ROUTES` tập trung:
  * **HR Module:** `/hr`, `/hr/employees`, `/hr/employees/:id`, `/hr/attendance`, `/hr/payroll`, `/hr/kpi`, `/hr/leave`, `/hr/org-chart`.
  * **LMS Module:** `/lms`, `/lms/explore`, `/lms/course/:id`, `/lms/course/:id/learn`, `/lms/progress`, `/lms/course/:courseId/quiz/:quizId`, `/lms/course/:courseId/lesson/:lessonId`.
  * **Khác:** Thêm đường dẫn chi tiết công việc `/task/:id`.

### B. Refactor cấu trúc định tuyến (Router Refactoring)
* **File thay đổi:** [router.tsx](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/src/app/router.tsx)
* **Chi tiết:**
  * Import và sử dụng toàn bộ hằng số từ `ROUTES` làm giá trị thuộc tính `path`.
  * Di chuyển toàn bộ các trang thuộc phân hệ **HR**, **LMS** (ngoại trừ các trang full-screen học/thi), và **Task Detail** vào làm con (children) của `AppLayout` route.
  * Xóa bỏ các định nghĩa trùng lặp đối với `/chat` và `/task` đang tồn tại trước đó.

### C. Tích hợp Header & Sidebar Đồng Bộ (Layout Integration)
* **File thay đổi:** [AppLayout.tsx](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/src/components/layout/AppLayout.tsx)
* **Chi tiết:**
  * Khôi phục hoạt động của thành phần `<Header />` hệ thống (uncomment `<Header />`).
  * Triển khai cấu trúc **Layout A (Header Top)**:
    ```tsx
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-[#FAFAF8]">
          <Outlet />
        </main>
      </div>
    </div>
    ```
    Giúp Header chiếm toàn bộ chiều ngang ở trên cùng, phía dưới chia làm 2 phần: Sidebar bên trái và nội dung trang cuộn độc lập bên phải.

### D. Cập nhật Sidebar và Tránh Tràn Layout
* **File thay đổi:** [AppSidebar.tsx](file:///c:/Projects/DigiFnb/ERP_CORPORATION/erp-corporation-fe-v2/src/components/layout/AppSidebar.tsx)
* **Chi tiết:**
  * Import `ROUTES` để đồng bộ liên kết menu điều hướng (`CORE_ITEMS`, `MODULE_ITEMS`) thay vì dùng chuỗi tĩnh.
  * Thay đổi lớp CSS từ `h-screen` thành `h-full` để sidebar chiếm vừa đủ chiều cao còn lại bên dưới Header thay vì vượt quá chiều cao màn hình (`100vh`).

---

## 2. Kết quả Đạt được (Benefits)
1. **Một Layout duy nhất:** Tất cả các phân hệ HR, LMS, Dashboard, Chat, Tasks đều có đầy đủ Header và Sidebar đồng bộ, thống nhất trải nghiệm người dùng.
2. **Không còn đường dẫn cứng:** Thuận tiện cho việc thay đổi cấu trúc URL sau này (chỉ cần sửa duy nhất tại `routes.ts`).
3. **Mã nguồn sạch sẽ (Clean Code):** Loại bỏ trùng lặp route định nghĩa thừa, cấu trúc thư mục phân tách chuẩn mực.
4. **Không lỗi tràn giao diện (Overflow-free):** Đã kiểm soát chiều cao độc lập của Sidebar và vùng hiển thị trang, cuộn mượt mà.
