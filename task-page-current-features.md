# Chức năng hiện có trong trang Task

Tài liệu này liệt kê chức năng **đang có thật trong code** của trang `Task`, dựa trên các component trong `src/features/task`.

## 1. Tải dữ liệu ban đầu

- Tải danh sách `status` và `priority` khi mở trang.
- Tải task theo từng `status`, rồi gộp về 1 danh sách chung.
- Có trạng thái loading khi đang tải dữ liệu.

Nguồn chính:
- `src/features/task/components/TaskView.tsx`

## 2. Chuyển chế độ xem

- Có 5 mode hiển thị:
  - `List`
  - `Board`
  - `Table`
  - `Calendar`
  - `Timeline`

Nguồn chính:
- `src/features/task/components/TaskView.tsx`

## 3. Tìm nhanh task

- Có popup `Quick Find`.
- Mở bằng nút `Tìm` hoặc phím tắt `Ctrl+K` / `Cmd+K`.
- Tìm theo các trường:
  - `title`
  - `description`
  - `code`
  - `status`
  - `assignee`
  - `priority`
- Chọn task trong kết quả sẽ mở panel chi tiết.

Nguồn chính:
- `src/features/task/components/TaskView.tsx`
- `src/features/task/components/search/TaskQuickFind.tsx`

## 4. Lọc và sắp xếp

### Bộ lọc

- Bật/tắt thanh filter.
- Tìm kiếm text trực tiếp trong filter bar.
- Lọc theo nhiều `status` cùng lúc.
- Lọc theo nhiều `priority` cùng lúc.
- Hiển thị chip filter đang chọn.
- Xóa từng filter riêng lẻ.
- Xóa toàn bộ filter.

### Sắp xếp

- Sắp xếp theo:
  - `CreatedAtUtc`: mới nhất / cũ nhất
  - `Title`: A-Z / Z-A
  - `DueDate`: sớm nhất / muộn nhất

Nguồn chính:
- `src/features/task/components/TaskView.tsx`
- `src/features/task/components/toolbar/TaskFilterBar.tsx`

## 5. Favorites và Recents

- Có thanh `Yêu thích` và `Gần đây`.
- Dữ liệu lưu trong `localStorage`.
- Mở task sẽ đẩy task vào danh sách recent.
- Có thể bật/tắt favorite từ task detail sheet.
- Click chip favorite/recent sẽ mở task tương ứng.

Nguồn chính:
- `src/features/task/components/task/TaskFavoritesBar.tsx`
- `src/features/task/hooks/useTaskFavorites.ts`
- `src/features/task/hooks/useTaskRecents.ts`

## 6. Tạo task mới

- Có nút `New Task` ở topbar.
- Có thêm task từ cuối bảng `Table`.
- Có thêm task từ từng cột trong `Board`.
- Form tạo task có các trường:
  - `title`
  - `description`
  - `status`
  - `priority`
  - `startDate`
  - `dueDate`
  - `estimatedHours`
- Có chọn template tạo nhanh:
  - `Bug Report`
  - `Feature Request`
  - `Chore / Refactor`
  - `Research / Spike`
- `code` task tự sinh tự động.

Lưu ý kỹ thuật:
- UI có chọn `assignee`, nhưng lúc tạo task hiện chưa gửi `assignee` vào request create.

Nguồn chính:
- `src/features/task/components/kanban/dialogs/TaskCreateDialog.tsx`

## 7. Export / Import CSV

- Xuất toàn bộ task ra file `tasks.csv`.
- Import task từ file CSV.
- Sau import, task mới được thêm vào danh sách hiện tại.

Nguồn chính:
- `src/features/task/components/TaskView.tsx`

## 8. List View

- Hiển thị task dạng danh sách nhóm.
- Hỗ trợ group theo:
  - `status`
  - `priority`
- Có thể expand/collapse từng group.
- Hiển thị badge priority.
- Hiển thị due date, bao gồm trạng thái `Today` và overdue.
- Hover task có action:
  - mở edit/detail
  - nhân bản task
  - xóa task
- Có drag-and-drop khi group theo `status`.
- Kéo task sang group khác sẽ cập nhật state local của task.

Lưu ý kỹ thuật:
- Drag ở `List View` hiện chỉ đổi `status` trong state front-end, chưa gọi API update.
- Nút `Add task` trong từng group hiện chỉ là UI, chưa có logic mở form.
- Checkbox complete trong từng row hiện chỉ hiển thị, chưa đổi trạng thái task.
- Khi group theo `priority`, không cho drag task giữa các group.

Nguồn chính:
- `src/features/task/components/list/TaskList.tsx`

## 9. Board View (Kanban)

- Hiển thị task theo cột trạng thái.
- Có drag-and-drop card giữa các cột.
- Có thể tạo cột mới.
- Có thể sửa tên cột.
- Có thể đổi màu cột.
- Có thể mở task detail từ card.
- Có thể tạo task mới trong board.

Lưu ý kỹ thuật:
- Tạo cột, sửa tên cột, đổi màu cột có gọi service update/create.
- Drag card dùng logic DnD riêng của kanban.

Nguồn chính:
- `src/features/task/components/kanban/KanbanBoard.tsx`

## 10. Table View

- Hiển thị task dạng bảng.
- Cột hiện có:
  - chọn dòng
  - tiêu đề
  - trạng thái
  - ưu tiên
  - người thực hiện
  - đến hạn
  - giờ ước tính
- Sort theo cột:
  - `title`
  - `status`
  - `priority`
  - `dueDate`
- Có chọn nhiều dòng.
- Có thanh bulk action khi đã chọn dòng.
- Click dòng sẽ mở task detail.
- Có nút thêm task mới ở cuối bảng.

Lưu ý kỹ thuật:
- Bulk actions `Đổi trạng thái` và `Giao cho` hiện mới là UI, chưa có logic xử lý.

Nguồn chính:
- `src/features/task/components/table/TaskTable.tsx`

## 11. Calendar View

- Hiển thị task theo lịch tháng.
- Điều hướng tháng trước / tháng sau.
- Có nút quay về `Hôm nay`.
- Task map theo `dueDate` hoặc `date`.
- Mỗi ngày hiển thị tối đa 3 task, còn dư sẽ hiện `+N task nữa`.
- Click task trên lịch sẽ mở task detail.

Nguồn chính:
- `src/features/task/components/calendar/TaskCalendar.tsx`

## 12. Timeline View

- Hiển thị task theo trục thời gian.
- Dùng `startDate`, `dueDate`, hoặc `date` để vẽ thanh timeline.
- Tự tính range ngày dựa trên task có ngày.
- Có header theo tuần và ngày.
- Highlight cột ngày hiện tại.
- Click tên task hoặc thanh timeline sẽ mở task detail.

Nguồn chính:
- `src/features/task/components/timeline/TaskTimeline.tsx`

## 13. Hover Preview

- Hover phần tử có `data-task-id` sẽ hiện popup preview.
- Preview hiển thị:
  - title
  - code
  - status
  - priority
  - due date
  - mô tả rút gọn

Nguồn chính:
- `src/features/task/components/task/TaskHoverPreview.tsx`

## 14. Task Detail Sheet

- Click task sẽ mở panel chi tiết bên phải.
- Có breadcrumb nếu task có parent.
- Có chỉnh sửa title trực tiếp.
- Có hiển thị trạng thái đang `Saving...` khi lưu.
- Khi đóng sheet, nếu có thay đổi thì tự build payload và gọi update.

Các field hiện được lưu qua `onTaskUpdate` khi đóng sheet:
- `title`
- `description`
- `statusId`
- `priorityId`
- `startDate`
- `dueDate`

Lưu ý kỹ thuật:
- `assignee` và `tag` có UI chỉnh sửa trong sheet, nhưng hiện chưa được đưa vào payload update.

Nguồn chính:
- `src/features/task/components/sheet/TaskSheet.tsx`
- `src/features/task/hooks/use-task-sheet.ts`

## 15. Header trong Task Detail Sheet

- Đóng sheet.
- Hiển thị mã task.
- Toggle favorite.
- Mở trang đầy đủ `/task/:id`.

Lưu ý kỹ thuật:
- Nút icon thùng rác trong header hiện chưa gắn `onClick` xóa task.
- Nút `More options` hiện chưa có logic.

Nguồn chính:
- `src/features/task/components/sheet/TaskSheetHeader.tsx`

## 16. Properties trong Task Detail Sheet

- Chỉnh `status`.
- Chỉnh `priority`.
- Chọn `assignee`.
- Nhập `tag`.
- Chọn `startDate` và `dueDate`.
- Xem `createdAt`.

Nguồn chính:
- `src/features/task/components/sheet/TaskSheetProperties.tsx`

## 17. Mô tả task

- Có editor mô tả dạng rich text.
- Truyền danh sách task vào editor, khả năng phục vụ mention/link nội bộ nếu editor hỗ trợ.

Nguồn chính:
- `src/features/task/components/sheet/TaskSheetDescription.tsx`
- `src/features/task/components/editor/TaskRichTextEditor.tsx`

## 18. Sub-tasks

- Thêm sub-task mới.
- Tích hoàn thành / bỏ hoàn thành.
- Xóa sub-task.
- Có progress bar theo tỷ lệ hoàn thành.
- Reset dữ liệu sub-task khi đổi task.

Lưu ý kỹ thuật:
- Sub-task hiện đang quản lý bằng state local trong component, chưa thấy gọi service/API lưu thật.

Nguồn chính:
- `src/features/task/components/sheet/TaskSheetSubTasks.tsx`

## 19. Attachments

- Tải danh sách attachment theo `taskId`.
- Upload nhiều file.
- Hiển thị preview ảnh nếu là ảnh.
- Hiển thị icon theo loại file.
- Download file đã upload.
- Xóa attachment.

Nguồn chính:
- `src/features/task/components/sheet/TaskSheetAttachments.tsx`

## 20. Dependencies

- Hiển thị 2 nhóm phụ thuộc:
  - `Blocks`
  - `Blocked by`
- Tìm task để thêm dependency.
- Loại trừ task hiện tại và task đã liên kết khỏi danh sách chọn.
- Xóa dependency đã gắn.

Nguồn chính:
- `src/features/task/components/sheet/TaskSheetDependencies.tsx`

## 21. Custom Properties

- Tải danh sách định nghĩa field custom.
- Tải giá trị custom theo task.
- Tạo field mới.
- Xóa field.
- Cập nhật value cho field custom.
- Các loại field đang hỗ trợ:
  - `select`
  - `multi-select`
  - `number`
  - `checkbox`
  - `url`

Nguồn chính:
- `src/features/task/components/sheet/TaskSheetCustomProperties.tsx`

## 22. Comments

- Có seed comment ban đầu.
- Thêm comment mới.
- Reply comment nhiều cấp.
- Expand/collapse replies.
- Gửi nhanh bằng Enter.
- Reset comment list khi đổi task.

Lưu ý kỹ thuật:
- Comment hiện đang dùng state local + dữ liệu seed trong component, chưa thấy gọi API/service lưu thật.

Nguồn chính:
- `src/features/task/components/sheet/TaskSheetComments.tsx`

## 23. Activity Log

- Tải activity log theo `taskId`.
- Hiển thị các action như:
  - tạo task
  - đổi tiêu đề
  - đổi trạng thái
  - đổi ưu tiên
  - cập nhật mô tả
  - đổi assignee
  - đổi due date
  - thêm comment
  - thêm attachment
- Có hiển thị `time ago`.

Nguồn chính:
- `src/features/task/components/sheet/TaskSheetActivityLog.tsx`

## 24. Chức năng có UI nhưng chưa có logic hoàn chỉnh

- Nút `Share` trên topbar: chưa có hành động.
- Nút `More options` trên topbar: chưa có hành động.
- Nút `Delete` trong `TaskSheetHeader`: chưa có hành động.
- Nút `More options` trong `TaskSheetHeader`: chưa có hành động.
- Checkbox complete trong `List View`: chưa cập nhật task.
- `Add task` row trong `List View`: chưa mở form tạo task.
- Bulk actions trong `Table View`: chưa có logic thực thi.
- `assignee` khi tạo task: có UI, chưa gửi request create.
- `assignee` và `tag` khi sửa trong sheet: có UI, chưa gửi request update.
- `Sub-tasks` và `Comments`: hiện thiên về local/mock state, chưa thấy persistence thật trong code component này.
