# Role Hierarchy Page — Task Tracking

## Goal
Admin page tại `/admin/role-hierarchy` hiển thị cây phân cấp roles dạng org-chart.
Tái sử dụng `OrgChartTree` (refactor thành generic) từ HR module.

## Checklist

### Refactor (không break HR)
- [x] `OrgChartTree.tsx` — generic với `renderNode` render prop
- [x] `OrgChartPage.tsx` — pass `renderNode` cho `OrgChartTree`

### Types & Config
- [x] `admin.types.ts` — thêm `RoleNode`
- [x] `routes.ts` — thêm `ROLE_HIERARCHY: '/admin/role-hierarchy'`
- [x] `permissions.ts` — thêm vào `PERMISSION_MAP`
- [x] `router.tsx` — thêm lazy route

### Admin Feature Files
- [x] `role-hierarchy.data.ts` — mock data (thay bằng API sau)
- [x] `RoleHierarchyNode.tsx` — role card component
- [x] `RoleHierarchySheet.tsx` — detail side sheet
- [x] `RoleHierarchyPage.tsx` — page shell (default export)

## Backend TODO
- [ ] Confirm endpoint `GET /api/roles/hierarchy` có không
- [ ] Nếu có: thêm `rolesService.hierarchy()` vào `roles.service.ts`
- [ ] Nếu không: giữ mock + `buildRoleTree(flat: RoleResponse[])` util từ `rolesService.list()`

## Notes
- Mock data: SUPER_ADMIN → HR_ADMIN → EMPLOYEE, CUSTOMER (ngang hàng HR_ADMIN)
- `OrgChartTree` generic constraint: `TNode extends { id: string; children: readonly TNode[] }`
- `RenderNodeProps<TNode>` export từ `OrgChartTree.tsx` để các node component import
