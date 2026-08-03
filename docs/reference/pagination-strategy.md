# Pagination Strategy — Theo Role

> Cập nhật: 2026-07-20

---

## 3 Role hiện tại

| Role | Dữ liệu thấy | Dataset size | Chiến lược |
|---|---|---|---|
| `ROLE_SUPER_ADMIN` | Toàn bộ task mọi phòng ban | Lớn (hàng nghìn) | **Server-side pagination bắt buộc** |
| `ROLE_HR_ADMIN` | Task trong phạm vi phòng ban quản lý | Vừa (vài trăm) | **Server-side pagination** |
| `ROLE_EMPLOYEE` | Task cá nhân được assign | Nhỏ (< 100) | **Client-side OK**, server-side khi cần |

---

## API contract (đã có)

```
GET /api/tasks?page=1&pageSize=20&...filters
→ { items: Task[], page: number, pageSize: number, totalCount: number }
```

Hiện FE nhận response nhưng bỏ qua `page`, `pageSize`, `totalCount` — chưa truyền params khi gọi.

---

## Quyết định per-role

### ROLE_SUPER_ADMIN
- Default `pageSize = 20`
- Phải có số trang + nút prev/next
- Filter bar luôn hiện (department, status, priority, assignee, date range)
- Group-by vẫn giữ nhưng phân trang **bên trong mỗi group** thay vì load tất cả

### ROLE_HR_ADMIN
- Default `pageSize = 20`
- Scope tự động filter theo department của HR (BE xử lý, FE không cần thêm param)
- Pagination UI giống Super Admin
- View "Nhân viên của tôi" → filter thêm `managerId`

### ROLE_EMPLOYEE
- Default `pageSize = 50` (vì dataset nhỏ, ít khi vượt)
- Nếu `totalCount <= 50` → ẩn pagination controls (không cần render)
- Nếu `totalCount > 50` → hiện pagination đơn giản (prev/next, không cần số trang)
- Tab "Của tôi" gọi `GET /api/tasks/my-tasks` thay vì `getAll`

---

## UI component cần thêm

```
src/features/task/components/shared/TaskPagination.tsx
```

Props tối thiểu:
```tsx
interface TaskPaginationProps {
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void // chỉ cần với Admin
}
```

Đặt dưới `TaskList` và `TaskTable`. Ẩn hoàn toàn khi `totalCount <= pageSize`.

---

## Chỗ cần sửa để wire pagination

| File | Việc cần làm |
|---|---|
| `taskApi.ts` (chưa tạo) | Truyền `{ page, pageSize }` vào query params |
| `TaskView.tsx` | Giữ state `page`, `pageSize`; reset về 1 khi filter thay đổi |
| `TaskList.tsx` | Nhận `tasks` đã phân trang từ server, bỏ client-side filter toàn bộ |
| `TaskTable.tsx` | Như TaskList |
| `TaskPage.tsx` | Chọn API gọi dựa theo role (`getAll` vs `getMyTasks`) |

---

## Thứ tự làm (gắn với todo #1 → #4)

1. Tạo `taskApi.ts` (todo #1) — wire real API + truyền `page`/`pageSize`
2. Tạo `TaskPagination.tsx` — component đơn giản prev/next + số trang
3. Wiring `TaskView.tsx` — state `page`, reset khi filter đổi
4. Role-aware gọi API trong `TaskPage.tsx` — Employee dùng `getMyTasks`

Skipped: per-group pagination bên trong Kanban — add khi Super Admin thực sự complain về perf.
