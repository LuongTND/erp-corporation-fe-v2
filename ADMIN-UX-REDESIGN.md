# Admin Panel — Phân tích & Đề xuất Thiết kế lại

> Ngày phân tích: 2026-08-03  
> Mức độ: Ultra ponytail — xóa trước, thêm sau, hỏi trước khi build

---

## 1. Hiện trạng — 6 route riêng

| Route | Trang | Loại | Ghi chú |
|-------|-------|------|---------|
| `/admin/accounts` | Vai trò | CRUD + drag-drop + assign permissions | Phức tạp nhất |
| `/admin/permissions` | Quyền hạn | **Read-only** | Auto-gen từ API, không có CRUD |
| `/admin/departments` | Phòng ban | CRUD flat table | Chỉ quản lý dept, không thấy members |
| `/admin/job-levels` | Cấp bậc | CRUD đơn giản | Độc lập, không liên quan luồng khác |
| `/admin/role-hierarchy` | Phân cấp vai trò | **Display-only**, **hardcoded data** | ⚠️ Dữ liệu cứng trong `.data.ts` |
| `/admin/org-hierarchy` | Cơ cấu tổ chức | Tree view + member CRUD | Dùng cùng API dept tree |

---

## 2. Vấn đề hiện tại

### 2.1 Quyền hạn — trang thừa
- **Read-only hoàn toàn**, không có Create/Update/Delete
- Admin vào chỉ để *xem tham chiếu* các permission code
- Tốn 1 route + 1 sidebar item cho 1 trang static
- **→ Không cần route riêng.** Embed vào Vai trò là đủ

### 2.2 Phòng ban + Cơ cấu tổ chức — split vô lý
- Cả hai dùng cùng `departmentsService` + `departmentTree` API
- `DepartmentsPage` = flat table CRUD (không thấy ai trong phòng ban)
- `OrgHierarchyPage` = tree + member CRUD (không thể tạo/sửa dept)
- Admin muốn thêm member → phải switch sang `/org-hierarchy`
- Admin muốn tạo dept → phải switch lại `/departments`
- **→ Luồng bị cắt đôi**, hai trang cần nhau nhưng tách nhau

### 2.3 Phân cấp vai trò — dữ liệu giả
- `role-hierarchy.data.ts` chứa **hardcoded static data**
- Không kết nối với API `/api/roles` thực tế
- Visualization đẹp nhưng không phản ánh dữ liệu thật
- **→ Cần quyết định**: connect API thật hoặc xóa trang này

### 2.4 Cấp bậc — ổn, giữ nguyên
- Simple CRUD độc lập
- Không liên quan luồng khác
- **→ Không cần thay đổi**

---

## 3. Đề xuất — Gộp thành 4 route (thay vì 6)

```
TRƯỚC (6 routes)          SAU (4 routes)
─────────────────         ──────────────────────────────
/admin/accounts     ─┐    /admin/roles          [Vai trò + Quyền hạn]
/admin/permissions  ─┘    
                          /admin/departments     [Phòng ban + Cơ cấu]
/admin/departments  ─┐    
/admin/org-hierarchy─┘    /admin/job-levels      [Cấp bậc — giữ nguyên]

/admin/role-hierarchy     /admin/role-hierarchy  [Kết nối API thật, hoặc xóa]

/admin/job-levels   ────  (unchanged)
```

---

## 4. Chi tiết từng thay đổi

### 4.1 `/admin/roles` — Vai trò (gộp Quyền hạn vào)

**Layout: 2 tab ngang**

```
┌─────────────────────────────────────────────────┐
│ [Vai trò]  [Quyền hạn]                          │
├─────────────────────────────────────────────────┤
│                                                 │
│  Tab "Vai trò":  (giữ nguyên RolesPage hiện tại)│
│  - Table CRUD                                   │
│  - Drag-drop reorder                            │
│  - PermissionsSheet khi click "Phân quyền"      │
│                                                 │
│  Tab "Quyền hạn":  (chuyển PermissionsPage vào) │
│  - Read-only reference list                     │
│  - Grouped by resource prefix                   │
│  - Search box                                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Thay đổi code:**
- Xóa route `/admin/permissions` + sidebar item
- Bọc `RolesPage` + `PermissionsPage` trong `<Tabs>` component
- URL state: `?tab=roles` | `?tab=permissions` (dùng searchParams)
- Không di chuyển hay rewrite logic — chỉ wrap trong tab container

**Effort:** ~30 phút (1 wrapper component + route cleanup)

---

### 4.2 `/admin/departments` — Phòng ban (gộp Cơ cấu tổ chức vào)

**Layout: Tab trên + split view**

```
┌─────────────────────────────────────────────────┐
│ [Danh sách]  [Cây tổ chức]                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  Tab "Danh sách":                               │
│  ┌────────────────────┬────────────────────┐    │
│  │  Dept Table (CRUD) │  Members Panel     │    │
│  │  - Tên, Mã, Parent │  (khi chọn 1 dept) │    │
│  │  - Create/Edit/Del │  - Add member      │    │
│  │                    │  - Edit job level  │    │
│  │                    │  - Remove member   │    │
│  └────────────────────┴────────────────────┘    │
│                                                 │
│  Tab "Cây tổ chức":                             │
│  - OrgChartTree (giữ nguyên từ OrgHierarchyPage)│
│  - Zoom controls                                │
│  - Click dept → members sheet                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Key insight:** `OrgHierarchyPage` đã có `ListView` (left: dept tree, right: members). Đây **chính xác** là thiết kế đúng — chỉ cần bỏ CRUD dept vào left panel thay vì để ở trang riêng.

**Thay đổi code:**
- Xóa route `/admin/org-hierarchy` + sidebar item
- `DepartmentsPage` thêm tab "Cây tổ chức" = lấy nguyên `OrgHierarchyPage` content
- Left panel của "Danh sách": table hiện tại + click row → hiện members ở right panel
- Reuse `MembersContent` component đã có trong `OrgHierarchyPage`

**Effort:** ~2-3 giờ (split panel layout + kết nối member panel vào DepartmentsPage)

---

### 4.3 `/admin/role-hierarchy` — Quyết định cần thiết

**Vấn đề:** Dữ liệu hardcoded trong `role-hierarchy.data.ts`, không phản ánh roles thực.

**2 lựa chọn:**

**Option A — Connect API (nên làm):**
```
- Fetch roles từ useRoles() 
- Build hierarchy từ role data (thêm parentRoleId vào Role schema)
- Hiện OrgChartTree với data thật
- Effort: phụ thuộc backend có hỗ trợ parentRoleId không
```

**Option B — Xóa trang (nhanh nhất):**
```
- Xóa route + sidebar item + toàn bộ RoleHierarchyPage + components
- Data hardcoded = misleading hơn là hữu ích
- Thêm lại khi backend support hierarchy thật
- Effort: 5 phút (xóa route + sidebar item)
```

**Khuyến nghị: Option B trước, Option A sau khi backend ready**

---

## 5. Kết quả sau khi gộp

### Sidebar sau khi gộp:
```
▼ Quản trị
   🔑 Vai trò          (tab: Vai trò | Quyền hạn)
   🏢 Phòng ban        (tab: Danh sách | Cây tổ chức)
   📊 Cấp bậc
   (bỏ: Quyền hạn, Phân cấp vai trò, Cơ cấu tổ chức)
```

### Số routes:
| | Trước | Sau |
|--|-------|-----|
| Routes | 6 | 3-4 |
| Sidebar items | 6 | 3 |
| Page components | 6 | 3 |
| Context switches cho admin | nhiều | ít |

---

## 6. Thứ tự làm (nếu go ahead)

1. **[Dễ, 30 phút]** Gộp Quyền hạn vào Vai trò tab
   - Files: `RolesPage.tsx`, router, sidebar config
   - Risk: thấp, chỉ wrap + xóa route

2. **[Dễ, 5 phút]** Xóa Phân cấp vai trò (nếu chọn Option B)
   - Files: router, sidebar config, `RoleHierarchyPage.tsx` + components
   - Risk: zero (hardcoded data, không ai depend)

3. **[Trung bình, 2-3 giờ]** Gộp Phòng ban + Cơ cấu tổ chức
   - Files: `DepartmentsPage.tsx`, router, sidebar config
   - Risk: trung bình, cần test member management flow

---

## 7. Không nên làm (YAGNI)

- ❌ Một mega-admin page cho tất cả 6 trang — quá phức tạp, context switch trong cùng page worse hơn separate routes
- ❌ i18n/translation system cho messages — hardcode tiếng Việt đủ rồi
- ❌ Permission-based tab visibility — đó là concern của auth layer, không phải UX layer
- ❌ Refactor toàn bộ component tree — chỉ wrap/move, không rewrite

---

## 8. Files cần động đến

```
src/
├── config/
│   └── routes.ts                    ← xóa 2-3 routes
├── app/
│   └── router.tsx                   ← xóa lazy imports + route definitions
├── components/layout/
│   └── Sidebar.tsx (hoặc nav config) ← xóa sidebar items
└── features/admin/
    ├── pages/
    │   ├── RolesPage.tsx            ← thêm Tabs wrapper
    │   ├── DepartmentsPage.tsx      ← thêm Tabs + member panel
    │   ├── PermissionsPage.tsx      ← giữ nguyên (chỉ di chuyển render location)
    │   ├── OrgHierarchyPage.tsx     ← extract MembersContent để reuse
    │   └── RoleHierarchyPage.tsx    ← xóa (nếu Option B)
    └── components/
        └── RoleHierarchyPage/       ← xóa (nếu Option B)
```
