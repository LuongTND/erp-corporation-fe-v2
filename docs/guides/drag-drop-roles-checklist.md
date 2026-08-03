# Checklist: Kéo thả thứ tự vai trò (Drag & Drop Roles)

**Mục tiêu:** Thay thế bảng tick-chọn thứ tự bằng kéo thả row trong `RolesPage.tsx`.  
**Thư viện đề xuất:** `@dnd-kit/core` + `@dnd-kit/sortable` (nhẹ, không cần jQuery, hỗ trợ keyboard/accessibility).

---

## 1. Cài đặt thư viện

```bash
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## 2. API / Backend

- [ ] Kiểm tra API `PUT /api/roles/reorder` (hoặc `PATCH`) có tồn tại chưa
- [ ] Nếu chưa: thêm endpoint nhận `{ roleIds: string[] }` — danh sách id theo thứ tự mới
- [ ] Nếu BE không cần thứ tự (cosmetic only): lưu thứ tự client-side trong localStorage (ponytail: bỏ qua BE nếu không cần persist)

---

## 3. State & Logic

- [ ] Thêm `localRoles` state trong `RolesPage` — copy từ `roles` khi data load xong
- [ ] Dùng `useEffect` sync `localRoles` khi `roles` thay đổi (query refetch)
- [ ] `handleDragEnd(event)` — dùng `arrayMove` từ `@dnd-kit/sortable` để reorder `localRoles`
- [ ] Gọi API reorder sau khi drag xong (optimistic update: cập nhật state trước, rollback nếu API fail)

---

## 4. Component

### 4a. Wrap table với DndContext

```tsx
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

// Trong JSX:
<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext items={localRoles.map(r => r.id)} strategy={verticalListSortingStrategy}>
    <TableBody>
      {localRoles.map(role => <SortableRoleRow key={role.id} role={role} ... />)}
    </TableBody>
  </SortableContext>
</DndContext>
```

### 4b. Tạo `SortableRoleRow` component

- [ ] Tạo file `src/features/admin/components/RolesPage/SortableRoleRow.tsx`
- [ ] Dùng `useSortable({ id: role.id })` hook
- [ ] Render `<TableRow ref={setNodeRef} style={style} {...attributes} {...listeners}>`
- [ ] Thêm drag handle icon (`GripVertical` từ lucide) ở cột đầu — tránh conflict với click buttons
- [ ] `listeners` chỉ gắn vào drag handle, không gắn toàn row (tránh block click Quyền/Edit/Xóa)

### 4c. Visual feedback khi drag

- [ ] Class `opacity-50` hoặc `ring-2 ring-primary` cho row đang kéo (`isDragging`)
- [ ] `DragOverlay` (optional) — hiển thị ghost row theo cursor khi kéo

---

## 5. Giữ search filter hoạt động

- [ ] Khi search đang active: disable drag (hoặc ẩn drag handle) — thứ tự filter không có nghĩa

---

## 6. System roles

- [ ] `isSystemRole = true` → không cho kéo, drag handle ẩn/disabled
- [ ] Hoặc: system roles ghim đầu danh sách, không tham gia sort

---

## 7. Accessibility

- [ ] `@dnd-kit` hỗ trợ keyboard mặc định (Space/Enter pick, arrow keys move, Escape cancel)
- [ ] Thêm `aria-label="Kéo để sắp xếp"` cho drag handle button

---

## 8. Thứ tự làm

1. Cài package
2. Thêm `SortableRoleRow` component
3. Wrap `RolesPage` với `DndContext`
4. Test drag visual (không cần API trước)
5. Kết nối API reorder (nếu cần persist)

---

## Tham khảo

- `@dnd-kit` docs: https://docs.dndkit.com/presets/sortable
- `arrayMove` util: `import { arrayMove } from '@dnd-kit/sortable'`
