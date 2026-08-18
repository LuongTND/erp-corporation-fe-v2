import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { departmentsService } from '../services/departments.service'
import type { AddBulkDepartmentMembersPayload, AddDepartmentMemberPayload, ListParams, UpdateDepartmentMemberPayload } from '../types/admin.types'

const KEY = 'departments'
const MEMBERS_KEY = 'department-members'

export function useDepartments(params?: ListParams) {
  return useQuery({
    queryKey: [KEY, params],
    queryFn: () => departmentsService.list(params),
  })
}

export function useCreateDepartment() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: departmentsService.create,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Tạo phòng ban thành công') },
    onError: (error) => { console.error(error); toast.error('Tạo phòng ban thất bại') },
  })
}

export function useUpdateDepartment() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof departmentsService.update>[1] }) =>
      departmentsService.update(id, data),
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Cập nhật phòng ban thành công') },
    onError: (error) => { console.error(error); toast.error('Cập nhật phòng ban thất bại') },
  })
}

export function useDeleteDepartment() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: departmentsService.delete,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Xóa phòng ban thành công') },
    onError: (error) => { console.error(error); toast.error('Xóa phòng ban thất bại') },
  })
}

export function useDepartmentTree() {
  return useQuery({
    queryKey: [KEY, 'tree'],
    queryFn: () => departmentsService.tree(),
    staleTime: 30_000,
  })
}

export function useDepartmentMembers(departmentId: string | null) {
  return useQuery({
    queryKey: [MEMBERS_KEY, departmentId],
    queryFn: () => departmentsService.getMembers(departmentId!),
    enabled: !!departmentId,
    staleTime: 30_000,
  })
}

export function useAddDepartmentMember() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: AddDepartmentMemberPayload }) =>
      departmentsService.addMember(userId, data),
    onSuccess: (_, { userId, data }) => {
      client.invalidateQueries({ queryKey: [MEMBERS_KEY, data.departmentId] })
      client.invalidateQueries({ queryKey: ['work-history', userId] })
      toast.success('Thêm thành viên thành công')
    },
    onError: (error) => { console.error(error); toast.error('Thêm thành viên thất bại') },
  })
}

export function useAddDepartmentMembers() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ departmentId, data }: { departmentId: string; data: AddBulkDepartmentMembersPayload }) =>
      departmentsService.addMembers(departmentId, data),
    onSuccess: (count, { departmentId }) => {
      client.invalidateQueries({ queryKey: [MEMBERS_KEY, departmentId] })
      client.invalidateQueries({ queryKey: ['work-history'] })
      toast.success(`Đã thêm ${count} thành viên`)
    },
    onError: (error) => { console.error(error); toast.error('Thêm thành viên thất bại') },
  })
}

export function useUpdateDepartmentMember() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, departmentId, data }: { userId: string; departmentId: string; data: UpdateDepartmentMemberPayload }) =>
      departmentsService.updateMember(userId, departmentId, data),
    onSuccess: (_, { departmentId }) => {
      client.invalidateQueries({ queryKey: [MEMBERS_KEY, departmentId] })
      toast.success('Cập nhật chức vụ thành công')
    },
    onError: (error) => { console.error(error); toast.error('Cập nhật thất bại') },
  })
}

export function useRemoveDepartmentMember() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, departmentId }: { userId: string; departmentId: string }) =>
      departmentsService.removeMember(userId, departmentId),
    onMutate: ({ userId, departmentId }) => {
      const key = [MEMBERS_KEY, departmentId]
      const previous = client.getQueryData(key)
      client.setQueryData(key, (old: { userId: string }[] | undefined) =>
        old?.filter(m => m.userId !== userId) ?? [],
      )
      return { previous, key }
    },
    onSuccess: (_, { userId, departmentId }) => {
      client.invalidateQueries({ queryKey: [MEMBERS_KEY, departmentId] })
      client.invalidateQueries({ queryKey: ['work-history', userId] })
      toast.success('Đã xóa khỏi phòng ban')
    },
    onError: (error, _, ctx) => {
      if (ctx) client.setQueryData(ctx.key, ctx.previous)
      console.error(error)
      toast.error('Xóa thất bại')
    },
  })
}

