# Task Module — Backlog & Hướng Triển Khai

> Tài liệu này liệt kê những gì **chưa hoàn thiện** trong module Task và thứ tự ưu tiên để dev follow.
> Cập nhật lần cuối: 2026-07-20

---

## 0. Bối cảnh hiện tại

Toàn bộ module Task đang chạy **mock in-memory** (`src/features/task/mocks/task.mock.ts`).  
Backend API đã được khai báo route tại `src/config/api-routes.ts` nhưng FE chưa gọi HTTP thật.

---

## 1. [BLOCKER] Wire real API

**Làm gì:**  
Tạo `src/features/task/api/taskApi.ts` — dùng `src/lib/api.ts` (axios instance), map từng method mock sang HTTP call thật theo `API_ROUTES`.

**Swap import sau khi xong:**
- `TaskView.tsx`
- `KanbanBoard.tsx`
- `TaskCreateDialog.tsx`
- `PriorityManagerDialog.tsx`

**Không xóa mock ngay** — giữ làm fallback dev-offline cho đến khi BE stable.

---

## 2. Thêm API routes còn thiếu

File `src/config/api-routes.ts` chưa có 4 nhóm endpoint mà mock đang implement:

| Nhóm | Endpoint cần thêm |
|---|---|
| Attachments | `GET/POST/DELETE /api/tasks/:id/attachments` |
| Dependencies | `GET/POST/DELETE /api/tasks/:id/dependencies` |
| Activity log | `GET/POST /api/tasks/:id/activities` |
| Custom properties | `GET/POST/DELETE /api/tasks/custom-properties` + `GET/PUT /api/tasks/:id/custom-properties` |

---

## 3. Fix stub methods trong mock

3 method hiện trả sai data — cần fix trước khi wire API để mock khớp contract BE:

| Method | Vấn đề | Fix |
|---|---|---|
| `updateProgress` | trả nguyên task, không update `actualHours` | map `actualHours` vào task object |
| `complete` | gọi `update({})` — không set status done | set `statusId` = id của status DONE |
| `bulkCreate` | trả `[]` | loop gọi `create` từng item trong array |

---

## 4. Pagination

API trả `{ items, page, pageSize, totalCount }` nhưng FE bỏ qua `page`/`pageSize`:
- Truyền `page` & `pageSize` param khi gọi `getAll`, `getMyTasks`
- Thêm UI phân trang ở **TaskList** và **TaskTable**

---

## 5. Dark mode CSS tokens

File `src/index.css` — `.dark` block **không có** override cho `--t-priority-*` và `--t-status-*`.  
Các token này hardcode hex màu sáng → hiển thị sai trong dark mode.

**Fix:** thêm vào `.dark {}`:
```css
--t-priority-high-bg: rgba(239,68,68,0.15);   --t-priority-high-text: #F87171;
--t-priority-med-bg:  rgba(245,158,11,0.15);  --t-priority-med-text:  #FBBF24;
--t-priority-low-bg:  rgba(96,165,250,0.15);  --t-priority-low-text:  #60A5FA;
--t-status-todo-bg:       rgba(156,163,175,0.15); --t-status-todo-text:       #9CA3AF;
--t-status-progress-bg:   rgba(245,158,11,0.15);  --t-status-progress-text:   #FBBF24;
--t-status-done-bg:       rgba(74,222,128,0.15);  --t-status-done-text:       #4ADE80;
--t-status-overdue-bg:    rgba(239,68,68,0.15);   --t-status-overdue-text:    #F87171;
```

---

## 6. Missing UI features

API route đã có nhưng FE chưa dùng:

| Feature | API route | Việc cần làm |
|---|---|---|
| Overdue view | `GET /api/tasks/overdue` | Tab hoặc filter preset "Quá hạn" |
| Upcoming view | `GET /api/tasks/upcoming` | Tab hoặc filter preset "Sắp đến hạn" |
| Group by project | `GET /api/tasks/project/:id` | Thêm option vào GroupBy dropdown |
| Group by department | `GET /api/tasks/department/:id` | Thêm option vào GroupBy dropdown |
| Deep link by code | `GET /api/tasks/code/:code` | Route `/task/code/TASK-001` |
| Bulk create via API | `POST /api/tasks/bulk` | Dùng thay vì loop `create` trong CSV import |
