import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { storesService } from '../services/stores.service'
import type { StoreHoursPayload } from '../types/admin.types'

export function useStores(params?: { searchText?: string; regionId?: string }) {
  return useQuery({
    queryKey: ['stores', params],
    queryFn: () => storesService.getStores({ ...params, top: 200 }),
  })
}

export function useSyncStores() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => storesService.syncStores(),
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
      toast.success(count === 0 ? 'Không có cửa hàng mới, đã đồng bộ hết' : `Đã thêm ${count} cửa hàng mới`)
    },
    onError: () => toast.error('Đồng bộ cửa hàng thất bại'),
  })
}

export function useStoresByRegion(regionId: string | null) {
  return useQuery({
    queryKey: ['stores-by-region', regionId],
    queryFn: () => storesService.getStoresByRegion(regionId!),
    enabled: !!regionId,
  })
}

export function useStoreHours(storeId: string | null) {
  return useQuery({
    queryKey: ['store-hours', storeId],
    queryFn: () => storesService.getStoreHours(storeId!),
    enabled: !!storeId,
  })
}

export function useUpsertStoreHours() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (payload: StoreHoursPayload) => storesService.upsertStoreHours(payload),
    onSuccess: (_, { storeId }) => {
      client.invalidateQueries({ queryKey: ['store-hours', storeId] })
      client.invalidateQueries({ queryKey: ['stores'] })
      client.invalidateQueries({ queryKey: ['stores-by-region'] })
      toast.success('Cập nhật giờ mở cửa thành công')
    },
    onError: () => toast.error('Cập nhật giờ mở cửa thất bại'),
  })
}

export function useToggleStoreActive() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (storeId: string) => storesService.toggleStoreActive(storeId),
    onSuccess: (isActive) => {
      client.invalidateQueries({ queryKey: ['stores'] })
      client.invalidateQueries({ queryKey: ['stores-by-region'] })
      toast.success(isActive ? 'Đã kích hoạt cửa hàng' : 'Đã ngưng hoạt động cửa hàng')
    },
    onError: () => toast.error('Cập nhật trạng thái cửa hàng thất bại'),
  })
}

export function useDeleteStore() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (storeId: string) => storesService.deleteStore(storeId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['stores'] })
      client.invalidateQueries({ queryKey: ['stores-by-region'] })
      toast.success('Đã xóa cửa hàng')
    },
    onError: () => toast.error('Xóa cửa hàng thất bại'),
  })
}

export function useAssignStoreManager() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ storeId, managerId }: { storeId: string; managerId: string | null }) =>
      storesService.assignManager(storeId, managerId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['stores'] })
      client.invalidateQueries({ queryKey: ['stores-by-region'] })
      toast.success('Đã cập nhật quản lý cửa hàng')
    },
    onError: () => toast.error('Cập nhật quản lý thất bại'),
  })
}

export function useMyStore() {
  return useQuery({
    queryKey: ['my-store'],
    queryFn: () => storesService.getMyStore(),
  })
}

export function useStoreMembers(storeId: string | null) {
  return useQuery({
    queryKey: ['store-members', storeId],
    queryFn: () => storesService.getStoreMembers(storeId!),
    enabled: !!storeId,
  })
}

export function useAddStoreMember() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ storeId, payload }: { storeId: string; payload: import('../types/admin.types').AddStoreMemberPayload }) =>
      storesService.addStoreMember(storeId, payload),
    onSuccess: (_, { storeId }) => {
      client.invalidateQueries({ queryKey: ['store-members', storeId] })
      client.invalidateQueries({ queryKey: ['my-store-members'] })
      toast.success('Đã thêm nhân sự vào cửa hàng')
    },
    onError: () => toast.error('Thêm nhân sự thất bại'),
  })
}

export function useRemoveStoreMember() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ storeId, userId }: { storeId: string; userId: string }) =>
      storesService.removeStoreMember(storeId, userId),
    onSuccess: (_, { storeId }) => {
      client.invalidateQueries({ queryKey: ['store-members', storeId] })
      client.invalidateQueries({ queryKey: ['my-store-members'] })
      toast.success('Đã gỡ nhân sự khỏi cửa hàng')
    },
    onError: () => toast.error('Gỡ nhân sự thất bại'),
  })
}

export function useMyStoreMembers() {
  return useQuery({
    queryKey: ['my-store-members'],
    queryFn: () => storesService.getMyStoreMembers(),
  })
}
