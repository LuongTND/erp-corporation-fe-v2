# Phân tích nghiệp vụ: Org Hierarchy (Phòng Ban + Chức Vụ + Role)

> **Ultra ponytail verdict**: Schema hiện tại đã có 90%. Cần thêm 1 column, 1 endpoint, 1 page.

---

## 1. Phân biệt 3 khái niệm cốt lõi

```
Role       → Bạn được làm GÌ trong hệ thống (permissions bundle)
JobLevel   → Bạn là AI trong tổ chức (chức vụ, rank, lương)
Department → Bạn thuộc ĐÂU trong cơ cấu tổ chức
```

| Khái niệm | Entity BE | Ví dụ | Quyết định gì |
|-----------|-----------|-------|----------------|
| Role | `Role` + `RolePermission` | `hr_manager`, `employee` | Có thể xem payroll không? |
| JobLevel | `JobLevel` | Giám đốc, Trưởng phòng, NV | Title hiển thị, band lương |
| Department | `Department` (tree) | HR, Marketing, Sales | Báo cáo lên ai |

**Sai lầm phổ biến**: Nhét chức vụ vào Role → `Role.RoleName = "Trưởng phòng HR"` → không scale, mỗi phòng 1 role mới.  
**Đúng**: Role là permission bundle tái sử dụng. JobLevel là title.

---

## 2. Schema hiện tại — cái đã có

```
Department (tree via ParentDepartmentId)
  └─ id, name, code, ParentDepartmentId, ManagerId

JobLevel (global)
  └─ id, LevelName, LevelOrder, DefaultScopeType, BaseSalaryMin/Max

User
  └─ JobLevelId FK→ JobLevel  ← global level (chức vụ chung)

UserDepartment (junction)
  └─ UserId, DepartmentId, IsPrimary, StartDate, EndDate, IsActive

Role
  └─ RoleName, DisplayName, IsSystemRole

UserRole
  └─ UserId, RoleId, AssignedAt, ExpiresAt, IsActive
```

---

## 3. Gap analysis — cái thiếu

### Vấn đề

`UserDepartment` không có `JobLevelId`. Không biết Alice là Trưởng phòng **trong HR** hay **trong Marketing**.

Hiện tại: `User.JobLevelId` = 1 chức vụ toàn cục → ok nếu mỗi người chỉ ở 1 phòng (trường hợp 95%).  
Nếu 1 người kiêm nhiệm 2 phòng với chức vụ khác nhau → **mất thông tin**.

### Fix: 1 column

```sql
ALTER TABLE UserDepartments ADD COLUMN JobLevelId UUID NULL REFERENCES JobLevels(Id);
```

EF Core:

```csharp
// UserDepartment.cs — thêm 1 field
public Guid? JobLevelId { get; set; }          // null = dùng User.JobLevelId
public JobLevel? JobLevel { get; set; }
```

Logic fallback: `UserDepartment.JobLevelId ?? User.JobLevelId`

> **ponytail**: Không cần "Department-scoped Roles" hay "RoleLevel" junction table. Giữ `Role` global, `JobLevel` per-department-membership. Đủ cho mọi usecase thực tế.

---

## 4. Luồng dữ liệu đầy đủ

```
User ──── UserRole ──── Role ──── RolePermission ──── Permission
  │                                                      │
  │                                          [Quyết định CAN DO]
  │
  └─── UserDepartment ──── Department (tree)
           │                    │
           └─ JobLevelId    ParentDepartmentId
                │
           [Quyết định IS IN + TITLE]
```

### Ví dụ thực tế

```
Alice:
  UserRole → [hr_manager]          // có quyền approve leave
  UserDepartment → HR, JobLevel: Trưởng phòng, IsPrimary: true

Bob:
  UserRole → [employee]            // quyền cơ bản
  UserDepartment → HR, JobLevel: Nhân viên, IsPrimary: true
  UserDepartment → Marketing, JobLevel: Nhân viên, IsPrimary: false

Carol (Giám đốc công ty):
  UserRole → [super_admin]
  UserDepartment → Ban Giám Đốc, JobLevel: Giám đốc, IsPrimary: true
```

---

## 5. Department hierarchy trong thực tế

```
Công ty TNHH ABC
├── Ban Giám Đốc
│   └── Giám đốc (Carol) ← ManagerId trên Department
├── HR
│   ├── Trưởng phòng (Alice) ← JobLevel trong UserDepartment
│   ├── Phó phòng (Dave)
│   └── Nhân viên (Bob, Eve...)
├── Marketing
│   ├── Trưởng phòng (Frank)
│   └── Nhân viên (Bob*) ← kiêm nhiệm
└── Sales
    └── ...
```

Tree này đã được implement ở `GetDepartmentTreeQueryHandler` — dùng `ToLookup(ParentDepartmentId)`.

---

## 6. API endpoints cần cho trang hierarchy

### Đã có

| Endpoint | Handler |
|----------|---------|
| `GET /departments/tree` | `GetDepartmentTreeQueryHandler` |
| `GET /roles` | `RolesController` |
| `GET /job-levels` | `JobLevelsController` |

### Cần thêm

```
GET /departments/{id}/members
  → Trả danh sách UserDepartment của phòng đó
  → Include: User (name, email, avatar), JobLevel (name, order)
  → Include: UserRoles của từng user (optional, lazy load)

PUT /departments/{id}/members/{userId}
  → Assign/update user vào phòng với JobLevelId
  → Body: { jobLevelId, isPrimary, startDate }

DELETE /departments/{id}/members/{userId}
  → Remove user khỏi phòng (soft: set IsActive=false, EndDate=today)
```

Query handler `GetDepartmentMembersQuery`:

```csharp
var members = await unitOfWork.Repository<UserDepartment>()
    .GetPagedAsync(new QueryInfo { NeedTotalCount = false },
        filter: ud => ud.DepartmentId == query.DepartmentId && ud.IsActive,
        ct: ct);

// Group by JobLevel.LevelOrder để sort theo thứ bậc
var result = members.Items
    .OrderBy(ud => ud.JobLevel?.LevelOrder ?? ud.User.JobLevel?.LevelOrder ?? 999)
    .Select(ud => new DepartmentMemberResponse { ... });
```

---

## 7. UI Page design — một trang quản lý tất cả

### Layout

```
┌─────────────────┬──────────────────────────────────────────┐
│  Department Tree│  [HR] — 12 thành viên                    │
│                 │                                           │
│  📁 Công ty ABC │  ┌──────────────────────────────────┐    │
│  ├─ Ban GĐ      │  │ + Thêm thành viên   [Xem Role]   │    │
│  ├─ HR   ◄──── │  └──────────────────────────────────┘    │
│  │  ├─ IT HR   │                                           │
│  ├─ Marketing   │  👑 Trưởng phòng (1)                     │
│  ├─ Sales       │  ┌──────────────────────────────────┐    │
│  └─ ...         │  │ 🧑 Alice Nguyen    [hr_manager]  │    │
│                 │  └──────────────────────────────────┘    │
│  [+ Phòng mới]  │                                           │
│                 │  👤 Phó phòng (1)                         │
│                 │  ┌──────────────────────────────────┐    │
│                 │  │ 🧑 Dave Tran       [hr_manager]  │    │
│                 │  └──────────────────────────────────┘    │
│                 │                                           │
│                 │  👤 Nhân viên (10)                        │
│                 │  ┌──────────────────────────────────┐    │
│                 │  │ 🧑 Bob Le          [employee]    │    │
│                 │  │ 🧑 Eve Pham        [employee]    │    │
│                 │  └──────────────────────────────────┘    │
└─────────────────┴──────────────────────────────────────────┘
```

### Components

```
OrgHierarchyPage
├── DepartmentTreePanel (reuse existing OrgChartTree hoặc shadcn TreeView)
│   └── DepartmentTreeNode (click → set selectedDepartmentId)
└── DepartmentMembersPanel
    ├── MembersByJobLevel (group by LevelOrder)
    │   └── MemberCard (avatar, name, roles badge)
    ├── AssignMemberDialog (pick user + jobLevel)
    └── MemberRolesSheet (xem/edit roles của 1 user, lazy open)
```

### State

```typescript
// Chỉ cần 2 queries, 1 state
const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null)
const { data: tree } = useDepartmentTree()                    // đã có
const { data: members } = useDepartmentMembers(selectedDeptId) // cần thêm
```

Không cần global store. `selectedDeptId` local state là đủ.

---

## 8. Implementation checklist

### BE (theo thứ tự)

- [ ] `UserDepartment.cs` — thêm `JobLevelId` nullable
- [ ] `UserDepartmentConfiguration.cs` — FK config, no cascade
- [ ] Migration: `AddJobLevelIdToUserDepartments`
- [ ] `GetDepartmentMembersQuery` + Handler (include User, JobLevel, UserRoles)
- [ ] `AssignDepartmentMemberCommand` + Handler (upsert UserDepartment)
- [ ] `RemoveDepartmentMemberCommand` + Handler (soft delete)
- [ ] Thêm 3 endpoints vào `DepartmentsController`

### FE (theo thứ tự)

- [ ] `admin.types.ts` — thêm `DepartmentMember`, `AssignMemberPayload`
- [ ] `departments.service.ts` — thêm `getMembers()`, `assignMember()`, `removeMember()`
- [ ] `use-department-members.ts` hook
- [ ] `MemberCard.tsx`
- [ ] `AssignMemberDialog.tsx`
- [ ] `MembersByJobLevel.tsx` (group + sort by LevelOrder)
- [ ] `DepartmentMembersPanel.tsx`
- [ ] `OrgHierarchyPage.tsx` — compose layout
- [ ] `routes.ts` + `router.tsx` + `permissions.ts`

---

## 9. Permissions cần

```
departments:view          ← đã có
departments:manage-members  ← mới (assign/remove user)
roles:assign              ← đã có (dùng lại cho assign role từ trang này)
```

---

## 10. Tại sao KHÔNG làm phức tạp hơn

| Ý tưởng bị reject | Lý do |
|-------------------|-------|
| `DepartmentRole` (role scoped to dept) | Overkill. Role là global permission bundle, dept không nên filter permission — dùng ScopeType trong permission nếu cần. |
| `RoleHierarchy` (role có parent role) | Codebase đã có `RoleHierarchyPage` nhưng đó là visual tree, không phải inheritance. Permission inheritance là antipattern trong RBAC. |
| Permission per department | Thêm dimension thứ 4 vào auth check → O(n³) complexity. Dùng resource-level permission nếu cần granularity. |
| Separate page cho từng concept | User phải nhảy 3 trang để setup 1 nhân viên. 1 trang hierarchy là UX win. |

---

## 11. Câu hỏi còn mở (cần confirm với product)

1. **Kiêm nhiệm**: 1 user ở 2 phòng với chức vụ khác nhau → schema đã handle (`UserDepartment.JobLevelId`), nhưng UI hiện tại `IsPrimary` → cần hiện cả secondary memberships không?

2. **Department Manager vs JobLevel**: `Department.ManagerId` hiện là FK tới User (manager của phòng). Có cần sync với JobLevel "Trưởng phòng" không? Hay để độc lập?  
   → Gợi ý: Độc lập. ManagerId = người chịu trách nhiệm dept trong orgchart. JobLevel = chức danh hành chính.

3. **Role assignment từ trang này**: Cho phép assign role trực tiếp từ member card, hay redirect sang Role Management page?  
   → Gợi ý: Sheet/drawer inline, dùng lại `useRoles` + existing assign API.
